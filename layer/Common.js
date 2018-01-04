const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');
// const classEnum = ['page', 'group', 'shapeGroup', 'shapePath', 'rectangle', 'text', 'oval', 'symbolMaster', 'symbolInstance', 'rect', 'bitmap', 'artboard'];
class CommonLayer {
    constructor (){
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }
    getStyle (){
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
        let finalStyle;
        if (this.parentLayer && this.parentLayer.type == 'shapeGroup') {
            let parentOtherStyle = {};
            if (this.parentLayer) {
                parentOtherStyle = {
                    color: this.parentLayer.style.color,
                    'background-color': this.parentLayer.style.backgroundColor,
                    'line-height': util.pxvalue(this.parentLayer.style.lineHeight),
                    'border-color': this.parentLayer.style.borderColor,
                    'border-width': util.pxvalue(this.parentLayer.style.borderWidth),
                    'border-style': this.parentLayer.style.borderStyle
                };
            }
            style = util.assign(parentOtherStyle, style);
        }
        if (StyleStore.get(this.selector)) {
            finalStyle = style;
        } else {
            StyleStore.set(this.selector, style);
            finalStyle = {};
        }
        return finalStyle;
    }
    getHtml (childString) {
        let layer = this.layer;
        return `<div id="${layer.id}" class="${layer.name}" style="${util.getStyleString(layer.finalStyle)}" >${childString}</div>`;
    }
}

module.exports = CommonLayer;