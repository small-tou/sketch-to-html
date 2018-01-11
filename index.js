const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const fse = require('fs-extra');

const StyleStore = require('./store/StyleStore');
const layerParser = require('./parser/layerParser');
const styleRender = require('./render/styleRender');
const htmlRender = require('./render/htmlRender');
const template = require('./template/template');
const util = require('./util.js');

var outPages = [];

/**
 * 以 ArtBoard 为单位输出页面
 * @param layer
 * @param pageName
 */
const handleArtBoard = (layer, pageName) => {
    if(layer.type == 'artboard') {
        StyleStore.reset();
        styleRender(layer, null, '../');
        var html = htmlRender(layer, null, '../');
        html = template(html, layer);
        fse.outputFileSync(`./output/html/${pageName}/artboard-${layer.name}.html`, html);
        fse.outputFileSync(`./output/html/${pageName}/artboard-${layer.name}.css`, StyleStore.toString());
        outPages.push({
            name: layer.name,
            url: `./${pageName}/artboard-${layer.name}.html`
        });
    } else {
        layer.childrens && layer.childrens.forEach((child) => {
            handleArtBoard(child, pageName);
        });
    }
};

module.exports = function (source, callback) {
    // 解压 sketch 文件
    exec(`rm -rf output/*;unzip -o ${source} -d output;`, (err, stdout, stderr) => {
        if(err) {
            console.error(err);
            return;
        }
        // 复制图片到结果文件夹
        fse.copySync('./output/images', './output/html/images');
        // 复制模板资源文件夹
        fse.copySync('./template/assets', './output/html/assets');
        // 复制首页
        fse.copySync('./template/index.html', './output/html/index.html');
        // 读取每个 page 的信息
        let files = fs.readdirSync('./output/pages');
        let fileStore = {};
        files.forEach((f) => {
            fileStore[f] = JSON.parse(fs.readFileSync('./output/pages/' + f).toString());
        });
        outPages = [];
        outResults = [];
        // 对每个页面进行处理解析
        files.forEach((f, i) => {
            let data = fileStore[f];
            let result = layerParser(data);
            outResults.push(result);
        });
        outResults.forEach((result) => {
            if(result.type === 'page') {
                handleArtBoard(result, `page-${result.name}`);
            }
        });
        // 输出模板页面 js 中的页面配置数据
        fse.outputFileSync('./output/html/index.js', (() => {
            let r = 'window.data = [];\n';
            outPages.forEach((p) => {
                r += `data.push({url:'${p.url}',title:'${p.name}',type:'folder'});\n`;
            });
            return r;
        })());
        callback();
        exec(`open "${__dirname + '/output/html/index.html'}"`);

    });
}


