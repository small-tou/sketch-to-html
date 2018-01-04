const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');

class ShapePathLayer {
    constructor () {
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }

    getStyle () {
        let otherStyle = {
            color: this.layer.style.color,
            'background-image': this.layer.style.backgroundImage ? `url(${path.join(this.imagePath, this.layer.style.backgroundImage)}.png)` : null,
            'background-color': this.layer.style.backgroundColor,
            'background': this.layer.style.linearGradientString,
            'border-radius': util.pxvalue(this.layer.style.borderRadius),
            'line-height': util.pxvalue(this.layer.style.lineHeight) || 'normal',
            'margin-top': util.pxvalue(this.layer.style.marginTop),
            'font-size': util.pxvalue(this.layer.style.fontSize),
            'border-color': this.layer.style.borderColor,
            'border-width': util.pxvalue(this.layer.style.borderWidth),
            'border-style': this.layer.style.borderStyle,
            'box-shadow': this.layer.style.boxShadow,
            '-webkit-text-stroke-width': util.pxvalue(this.layer.style.textStrokeWidth),
            '-webkit-text-stroke-color': util.pxvalue(this.layer.style.textStrokeColor)
        };
        let frameStyle = {
            position: 'absolute',
            left: util.pxvalue(this.layer.frame.x),
            top: util.pxvalue(this.layer.frame.y),
            width: util.pxvalue(this.layer.frame.width),
            height: util.pxvalue(this.layer.frame.height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            // 'background-color': layer.style.backgroundColor,
            // 'background-image': layer.style.backgroundImage ? `url(${path.join(imagePath, layer.style.backgroundImage)}.png)` : null,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity
        };
        let style = Object.assign({}, frameStyle, otherStyle);
        // 要出 svg 的条件
        let pathStyle = {
            fill: this.parentLayer.style.backgroundColor || 'none',
            stroke: this.parentLayer.style.borderColor,
            width: util.pxvalue(this.layer.frame.width),
            height: util.pxvalue(this.layer.frame.height),
            'stroke-width': this.parentLayer.style.borderWidth ? (this.parentLayer.style.borderWidth + 'px') : 1
        };
        let finalStyle;
        style = util.assign(pathStyle, style);
        if (StyleStore.get(this.selector)) {
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
<svg id="${layer.id}" version="1.1" xmlns="http://www.w3.org/2000/svg" class="${layer.name}" style="${util.getStyleString(layer.finalStyle)}"  >
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