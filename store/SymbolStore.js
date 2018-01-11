const util = require('./../util');
/**
 * 复用 Symbol 存储
 */
class SymbolStore {

}

SymbolStore.data = {};
/**
 * 设置 Symbol
 * @param key
 * @param value
 */
SymbolStore.set = function (key, value) {
    SymbolStore.data[key] = value;
};
/**
 * 获取 Symbol
 * @param key
 * @returns {*}
 */
SymbolStore.get = function (key) {
    return SymbolStore.data[key];
};
/**
 * 重置 存储
 * @returns {{}}
 */
SymbolStore.reset = function () {
    return SymbolStore.data = {};
};
module.exports = SymbolStore;