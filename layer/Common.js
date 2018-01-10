const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');
// const classEnum = ['page', 'group', 'shapeGroup', 'shapePath', 'rectangle', 'text', 'oval', 'symbolMaster', 'symbolInstance', 'rect', 'bitmap', 'artboard'];
class CommonLayer {
    constructor () {
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }

    getStyle () {
        let otherStyle = {
            'color': this.layer.style.color,
            'background-image': this.layer.style.backgroundImage ? `url(${path.join(this.imagePath, this.layer.style.backgroundImage)}.png)` : null,
            'background-color': this.layer.style.backgroundColor,
            'background': this.layer.style.linearGradientString,
            'border-radius': util.pxvalue(this.layer.style.borderRadius),
            'line-height': util.pxvalue(this.layer.style.lineHeight) || 'normal',
            'margin-top': util.pxvalue(this.layer.style.marginTop),
            'font-size': util.pxvalue(this.layer.style.fontSize),
            'font-family': this.layer.style.fontFamily,
            'border-color': this.layer.style.borderColor,
            'border-width': util.pxvalue(this.layer.style.borderWidth),
            'border-style': this.layer.style.borderStyle,
            'box-shadow': this.layer.style.boxShadow,
            'letter-spacing': util.pxvalue(this.layer.style.letterSpacing),
            '-webkit-text-stroke-width': util.pxvalue(this.layer.style.textStrokeWidth),
            '-webkit-text-stroke-color': util.pxvalue(this.layer.style.textStrokeColor)
        };
        let parentOtherStyle = {};
        let width = this.layer.frame.width, height = this.layer.frame.height;
        if(this.parentLayer && this.parentLayer.type == 'shapeGroup') {
            parentOtherStyle = {
                'color': this.parentLayer.style.color,
                'background-color': this.parentLayer.style.backgroundColor,
                'background-image': this.parentLayer.style.backgroundImage ? `url(${path.join(this.imagePath, this.parentLayer.style.backgroundImage)}.png)` : null,
                'background': this.parentLayer.style.linearGradientString,
                'line-height': util.pxvalue(this.parentLayer.style.lineHeight),
                'border-color': this.parentLayer.style.borderColor,
                'border-width': util.pxvalue(this.parentLayer.style.borderWidth),
                'border-style': this.parentLayer.style.borderStyle,
                'border-radius': util.pxvalue(this.parentLayer.style.borderRadius),
            };
            let borderWidth = this.parentLayer.style.borderWidth || 0;
            if(this.parentLayer.style.borderPosition == 0) {
                // center
                width = width - borderWidth;
                height = height - borderWidth;
            }else if(this.parentLayer.style.borderPosition == 1) {
                // inside
                let borderWidth = this.parentLayer.style.borderWidth || 0;
                width = width - borderWidth*2;
                height = height - borderWidth*2;
            }
            delete this.parentLayer.finalStyle['background']
            delete this.parentLayer.finalStyle['background-image']
            delete this.parentLayer.finalStyle['background-color']

        }
        let frameStyle = {
            'position': 'absolute',
            'left': util.pxvalue(this.layer.frame.x),
            'top': util.pxvalue(this.layer.frame.y),
            'width': util.pxvalue(width),
            'height': util.pxvalue(height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity,
            'overflow': 'hidden'
        };

        let style = Object.assign({}, frameStyle, otherStyle);
        style = util.assign(parentOtherStyle, style);
        let finalStyle;

        if(StyleStore.get(this.selector)) {
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