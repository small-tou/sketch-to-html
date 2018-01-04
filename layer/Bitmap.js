const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');

class BitmapLayer {
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
        StyleStore.set(this.selector,{});
        return Object.assign({}, frameStyle, otherStyle);
    }
    getHtml () {
        let layer = this.layer;
        let style = layer.finalStyle;
        let color = style['background-color'];
        let imgStyle = {};
        imgStyle['position'] = 'absolute';
        imgStyle['width'] = '100%';
        imgStyle['height'] = '100%';
        if (color){
            imgStyle['left'] = '-10000px';
            imgStyle['-webkit-filter'] = `drop-shadow(${color} 10000px 0px)`;
        }
        delete layer.finalStyle['background-color'];
        layer.finalStyle.overflow = 'hidden';
        return `<div id="${layer.id}" style="${util.getStyleString(layer.finalStyle)}" class="${layer.name}"><img  style="${util.getStyleString(imgStyle)}" src="${path.join(this.imagePath, layer.image)}"  ></img></div>`;

    }
}

module.exports = BitmapLayer;