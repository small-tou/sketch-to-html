const StyleStore = require('../store/StyleStore');
const Layer = require('../layer/LayerFactory');
const SymbolStore = require('../store/SymbolStore');
const path = require('path');
const styleRender = function (layer, parentLayer, imagePath = '', selector = '') {
    if (!layer.isVisible) {
        return '';
    }
    if (layer.type == 'symbolInstance') {
        try{
        layer.childrens = SymbolStore.get(layer.symbolID).childrens;
        }catch(e){
            layer.childrens=[];
        }
    }
    selector = selector + '.' + layer.name + ' ';

    let style = {};
    let layerInstance = new Layer();
    layerInstance.layer = layer;
    layerInstance.parentLayer = parentLayer;
    layerInstance.imagePath = imagePath;
    layerInstance.selector = selector;
    layer.finalStyle = layerInstance.getStyle();
    if(layer.type=='artboard')layer.finalStyle.overflow = 'hidden';
    if (layer.isMask) {
        // 如果当前是一个遮罩，给其父元素一个 mask-image ，并将此layer的frame赋值给父元素。
        if (layer.style.linearGradientString) {
            parentLayer.finalStyle['-webkit-mask-image'] = layer.style.linearGradientString;
        }
        if (layer.style.backgroundImage) {
            parentLayer.finalStyle['-webkit-mask-image'] = `image(url(${path.join(imagePath, layer.style.backgroundImage)}))`;
        }
        parentLayer.finalStyle.width = layer.finalStyle.width;
        parentLayer.finalStyle.height = layer.finalStyle.height;
        parentLayer.finalStyle.overflow = 'hidden';
    }
    layer.childrens && layer.childrens.forEach((child) => {
        styleRender(child, layer, imagePath, selector);
    });

};

module.exports = styleRender;