const BitmapLayer = require('./Bitmap');
const ShapePathLayer = require('./ShapePath');
const ShapeGroupLayer = require('./ShapeGroup');
const GroupLayer = require('./Group');
const CommonLayer = require('./Common');

class Layer {
    constructor (){
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }

    getStyle (){
        let layer = this.layer;
        let parentLayer = this.parentLayer;
        let imagePath = this.imagePath;
        let selector = this.selector;
        let finalStyle = {};
        if (ShapePathLayer.isShapePath(layer, parentLayer)) {
            let shapePathLayer = new ShapePathLayer();
            shapePathLayer.layer = layer;
            shapePathLayer.parentLayer = parentLayer;
            shapePathLayer.imagePath = imagePath;
            shapePathLayer.selector = selector;
            finalStyle = shapePathLayer.getStyle();
        }
        else if (layer.type == 'shapeGroup') {
            let shapeGroupLayer = new ShapeGroupLayer();
            shapeGroupLayer.layer = layer;
            shapeGroupLayer.parentLayer = parentLayer;
            shapeGroupLayer.imagePath = imagePath;
            shapeGroupLayer.selector = selector;
            finalStyle = shapeGroupLayer.getStyle();
        } else if (layer.type == 'group') {
            let groupLayer = new GroupLayer();
            groupLayer.layer = layer;
            groupLayer.parentLayer = parentLayer;
            groupLayer.imagePath = imagePath;
            groupLayer.selector = selector;
            finalStyle = groupLayer.getStyle();
        } else if (layer.type == 'bitmap') {
            let bitmapLayer = new BitmapLayer();
            bitmapLayer.layer = layer;
            bitmapLayer.parentLayer = parentLayer;
            bitmapLayer.imagePath = imagePath;
            bitmapLayer.selector = selector;
            finalStyle = bitmapLayer.getStyle();
        } else {
            let commonLayer = new CommonLayer();
            commonLayer.layer = layer;
            commonLayer.parentLayer = parentLayer;
            commonLayer.imagePath = imagePath;
            commonLayer.selector = selector;
            finalStyle = commonLayer.getStyle();
        }
        return finalStyle;
    }
    getHtml (childString) {
        let html = '';
        let layer = this.layer;
        let parentLayer = this.parentLayer;
        let imagePath = this.imagePath;
        let selector = this.selector;
        if (ShapePathLayer.isShapePath(layer, parentLayer)) {
            let shapePathLayer = new ShapePathLayer();
            shapePathLayer.layer = layer;
            shapePathLayer.parentLayer = parentLayer;
            shapePathLayer.imagePath = imagePath;
            shapePathLayer.selector = selector;
            html = shapePathLayer.getHtml();
        }
        else if (layer.type == 'shapeGroup') {
            let shapeGroupLayer = new ShapeGroupLayer();
            shapeGroupLayer.layer = layer;
            shapeGroupLayer.parentLayer = parentLayer;
            shapeGroupLayer.imagePath = imagePath;
            shapeGroupLayer.selector = selector;
            html = shapeGroupLayer.getHtml(childString);
        } else if (layer.type == 'group') {
            let groupLayer = new GroupLayer();
            groupLayer.layer = layer;
            groupLayer.parentLayer = parentLayer;
            groupLayer.imagePath = imagePath;
            groupLayer.selector = selector;
            html = groupLayer.getHtml(childString);
        } else if (layer.type == 'bitmap') {
            let bitmapLayer = new BitmapLayer();
            bitmapLayer.layer = layer;
            bitmapLayer.parentLayer = parentLayer;
            bitmapLayer.imagePath = imagePath;
            bitmapLayer.selector = selector;
            html = bitmapLayer.getHtml();
        } else {
            let commonLayer = new CommonLayer();
            commonLayer.layer = layer;
            commonLayer.parentLayer = parentLayer;
            commonLayer.imagePath = imagePath;
            commonLayer.selector = selector;
            html = commonLayer.getHtml(childString);
        }
        return html;
    }
}

module.exports = Layer;
