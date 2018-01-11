const util = require('./../util');
/**
 * 样式缓存类，用于分离html和css，存储css后，可以在最后统一输出到css文件
 *
 */
class StyleStore {

}

StyleStore.data = {};
/**
 * 保存某个 selector 的样式
 * @param selector
 * @param value
 */
StyleStore.set = function (selector, value) {
    StyleStore.data[selector] = value;
};
/**
 * 获取某个 selector 的样式
 * @param selector
 * @returns {*}
 */
StyleStore.get = function (selector) {
    return StyleStore.data[selector];
};
/**
 * 重置所有数据
 * @returns {{}}
 */
StyleStore.reset = function () {
    return StyleStore.data = {};
};
/**
 * 输出样式文本
 * @returns {*}
 */
StyleStore.toString = function () {
    let obj = StyleStore.data;
    var result = '';
    for(var selector in obj) {
        var style = '';
        for(var key in obj[selector]){
            if(obj[selector][key]!==null&&obj[selector][key]!==undefined){
                style += `${key}:${obj[selector][key]};\n`
            }

        }
        result += `
${selector} {
    ${style}
}`
    }
    return result;
};
module.exports = StyleStore;