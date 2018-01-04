const util = require('./../util');

class StyleStore {

}

StyleStore.data = {};
StyleStore.set = function(selector,value){
    StyleStore.data[selector] = value;
};
StyleStore.get = function(selector){
    return StyleStore.data[selector];
};
StyleStore.reset = function(){
    return StyleStore.data = {};
};
StyleStore.toString = function(){
    return util.objectToCSS(StyleStore.data);
};
module.exports = StyleStore;