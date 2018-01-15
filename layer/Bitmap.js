const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');
const LayerProtocol = require('./LayerProtocol');

class BitmapLayer extends LayerProtocol {
    constructor () {
        super();
    }

    getStyle () {
        let otherStyle = {
            color: this.layer.style.color,
            'background-image': this.layer.style.backgroundImage ? `url(${path.join(this.imagePath, this.layer.style.backgroundImage)}.png)` : null,
            'background-color': this.layer.style.backgroundColor,
            'border-radius': util.px2rem(this.layer.style.borderRadius),
            'border-color': this.layer.style.borderColor,
            'border-width': util.px2rem(this.layer.style.borderWidth),
            'border-style': this.layer.style.borderStyle,
            'box-shadow': this.layer.style.boxShadow,
        };
        let frameStyle = {
            position: 'absolute',
            left: util.px2rem(this.layer.frame.x),
            top: util.px2rem(this.layer.frame.y),
            width: util.px2rem(this.layer.frame.width),
            height: util.px2rem(this.layer.frame.height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'opacity': this.layer.style.opacity
        };
        StyleStore.set(this.selector, {});
        return Object.assign({}, frameStyle, otherStyle);
    }

    getHtml () {
        let layer = this.layer;
        let style = layer.finalStyle;
        let color = style['background-color'];
        // 处理图片变色的特性
        let imgStyle = {};
        imgStyle['position'] = 'absolute';
        imgStyle['width'] = '100%';
        imgStyle['height'] = '100%';
        if(color) {
            imgStyle['left'] = '-10000px';
            imgStyle['-webkit-filter'] = `drop-shadow(${color} 10000px 0px)`;
        }
        delete layer.finalStyle['background-color'];
        layer.finalStyle.overflow = 'hidden';
        return `<div id="${layer.id}" style="${util.getStyleString(layer.finalStyle)}" class="${layer.name}"><img  style="${util.getStyleString(imgStyle)}" src="${path.join(this.imagePath, layer.image)}"  ></img></div>`;

    }
}

module.exports = BitmapLayer;