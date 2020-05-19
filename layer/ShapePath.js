const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');
const LayerProtocol = require('./LayerProtocol');

class ShapePathLayer extends LayerProtocol {
    constructor () {
        super();
    }

    getStyle () {
        let otherStyle = {
            color: this.layer.style.color,
            'background-image': this.layer.style.backgroundImage ? `url(${path.join(this.imagePath, this.layer.style.backgroundImage)})` : null,
            'background-color': this.layer.style.backgroundColor,
            'background': this.layer.style.linearGradientString,
            'border-radius': util.px2rem(this.layer.style.borderRadius),
            'line-height': util.px2rem(this.layer.style.lineHeight) || 'normal',
            'margin-top': util.px2rem(this.layer.style.marginTop),
            'font-size': util.px2rem(this.layer.style.fontSize),
            'border-color': this.layer.style.borderColor,
            'border-width': util.px2rem(this.layer.style.borderWidth),
            'border-style': this.layer.style.borderStyle,
            'box-shadow': this.layer.style.boxShadow,
            '-webkit-text-stroke-width': util.px2rem(this.layer.style.textStrokeWidth),
            '-webkit-text-stroke-color': util.px2rem(this.layer.style.textStrokeColor)
        };
        let width = this.layer.frame.width, height = this.layer.frame.height;
        let frameStyle = {
            position: 'absolute',
            left: util.px2rem(this.layer.frame.x),
            top: util.px2rem(this.layer.frame.y),
            width: util.px2rem(width),
            height: util.px2rem(height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity
        };
        let style = Object.assign({}, frameStyle, otherStyle);
        // 要出 svg 的条件
        let pathStyle = {
            fill: this.parentLayer.style.backgroundColor || 'none',
            stroke: this.parentLayer.style.borderColor,
            width: util.px2rem(this.layer.frame.width),
            height: util.px2rem(this.layer.frame.height),
            'stroke-width': this.parentLayer.style.borderWidth ? (this.parentLayer.style.borderWidth + 'px') : 1
        };
        let finalStyle;
        style = util.assign(pathStyle, style);
        if(StyleStore.get(this.selector)) {
            finalStyle = style;
        } else {
            StyleStore.set(this.selector, style);
            finalStyle = {};
        }
        return finalStyle;
    }

    getHtml () {
        let layer = this.layer;
        return `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="${layer.name}" style="${util.getStyleString(layer.finalStyle)}"  >
    <path d="${layer.path}" />
</svg>`;
    }


}
ShapePathLayer.isShapePath = function (layer, parentLayer) {
    return (layer.type === 'oval' && !layer.isCircle) ||
      (layer.type === 'rectangle' && !layer.isRect) ||
      (layer.path && layer.type === 'shapePath') ||
      (parentLayer && parentLayer.type == 'shapeGroup' && parentLayer.childrens.length > 1);
};
module.exports = ShapePathLayer;