const util = require('../util');

class ShapeGroupLayer {
    constructor (){
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }
    getStyle (){
        let otherStyl;
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
        if (this.layer.style.backgroundImage && this.layer.childrens.length == 1) {
            this.layer.childrens[0].style.backgroundImage = this.layer.style.backgroundImage;
            this.layer.style.backgroundImage = null;
        }
        return Object.assign({}, frameStyle);
    }
    getHtml (childString) {
        let layer = this.layer;
        return `<div id="${layer.id}" class="${layer.name}" style="${util.getStyleString(layer.finalStyle)}" >${childString}</div>`;
    }
}

module.exports = ShapeGroupLayer;