const util = require('./../util');

class SymbolStore {

}

SymbolStore.data = {};
SymbolStore.set = function(key,value){
    SymbolStore.data[key] = value;
};
SymbolStore.get = function(key){
    return SymbolStore.data[key];
};
SymbolStore.reset = function(){
    return SymbolStore.data = {};
};
module.exports = SymbolStore;