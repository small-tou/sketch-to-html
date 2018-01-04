const util = require('./../util.js');
const SymbolStore = require('./../store/SymbolStore');
const styleParser = require('./styleParser');
const pathParser = require('./pathParser');
const pinyin = require('node-pinyin');
const result = [];
const nameStore = [];
const rename = function (name) {
    let index = 1;
    let nextName = name;

    while (nameStore.indexOf(nextName) !== -1) {
        nextName = name + '_' + (index++);
    }
    return nextName;
};
const handleItem = function (item) {
    let result = {};
    result.id = item.do_objectID;
    result.frame = item.frame || {};
    result.style = styleParser(item.style, item.attributedString, item);
    result.path = pathParser(item);
    result.isVisible = item.isVisible;
    let name = item.name ? item.name : '未命名';
    name = name.replace(/[\u4e00-\u9fa5]*/, function (m) {
        return pinyin(m, {
            style: 'normal'
        });
    }).replace(/^([^a-z_A-Z])/, '_$1').replace(/[^a-z_A-Z0-9-]/g, '_');
    result.name = rename(name);
    nameStore.push(result.name);
    result.type = item._class;
    if (item._class === 'oval') {
        result.isCircle = util.isCircle(item);
        if (result.isCircle) {
            const p1 = util.toPoint(item.path.points[0].point, item);
            const p2 = util.toPoint(item.path.points[1].point, item);
            const p3 = util.toPoint(item.path.points[2].point, item);
            const p4 = util.toPoint(item.path.points[3].point, item);
            result.style.borderRadius = (p1.y - p3.y) / 2;
        }
    }
    result.isMask = !!item.hasClippingMask;
    if (item._class === 'rectangle') {
        result.isRect = util.isRect(item);
    }
    if (item._class === 'text') {
        result.text = result.style.text || item.name;
    }
    if (item._class === 'bitmap') {
        result.image = item.image._ref + '.png';
    }
    if (item._class === 'artboard') {
        result.frame.x = null;
        result.frame.y = null;
    }
    result.symbolID = item.symbolID;

    return result;
};

const layerParser = function (item) {
    let element = {};
    element = handleItem(item);
    if (item.layers) {
        element.childrens = [];
        item.layers.forEach((_item) => {
            let r = layerParser(_item);
            if (r) {
                element.childrens.push(r);
            }
        });
    }
    if (element.type === 'symbolMaster') {
        SymbolStore.set(element.symbolID,element);
    }
    return element;
};

module.exports = layerParser;