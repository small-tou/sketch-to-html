const BitmapLayer = require('./Bitmap');
const ShapePathLayer = require('./ShapePath');
const ShapeGroupLayer = require('./ShapeGroup');
const GroupLayer = require('./Group');
const CommonLayer = require('./Common');
const TextLayer = require('./Text');

class Layer {
    constructor () {
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }

    getStyle () {
        let finalLayer;
        if(ShapePathLayer.isShapePath(this.layer, this.parentLayer)) {
            finalLayer = new ShapePathLayer();
        } else if(this.layer.type == 'shapeGroup') {
            finalLayer = new ShapeGroupLayer();
        } else if(this.layer.type == 'group') {
            finalLayer = new GroupLayer();
        } else if(this.layer.type == 'bitmap') {
            finalLayer = new BitmapLayer();
        } else if(this.layer.type == 'text') {
            finalLayer = new TextLayer();
        } else {
            finalLayer = new CommonLayer();
        }
        finalLayer.layer = this.layer;
        finalLayer.parentLayer = this.parentLayer;
        finalLayer.imagePath = this.imagePath;
        finalLayer.selector = this.selector;
        return finalLayer.getStyle();
    }

    getHtml (childString) {
        let finalLayer;
        if(ShapePathLayer.isShapePath(this.layer, this.parentLayer)) {
            finalLayer = new ShapePathLayer();
        } else if(this.layer.type == 'shapeGroup') {
            finalLayer = new ShapeGroupLayer();
        } else if(this.layer.type == 'group') {
            finalLayer = new GroupLayer();
        } else if(this.layer.type == 'bitmap') {
            finalLayer = new BitmapLayer();
        } else if(this.layer.type == 'text') {
            finalLayer = new TextLayer();
        } else {
            finalLayer = new CommonLayer();
        }
        finalLayer.layer = this.layer;
        finalLayer.parentLayer = this.parentLayer;
        finalLayer.imagePath = this.imagePath;
        finalLayer.selector = this.selector;
        return finalLayer.getHtml(childString);
    }
}

module.exports = Layer;
