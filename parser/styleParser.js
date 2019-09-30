const colorParser = require('./../util').color;
const bplistParser = require('bplist-parser');
const NSArchiveParser = require('./NSArchiveParser.js');
const util = require('./../util.js');

const styleParser = function (style, attributedString, layer) {
    let result = {};
    if (layer.fixedRadius) {
        result.borderRadius = layer.fixedRadius;
    }
    if (layer.isFlippedHorizontal) {
        result.transform = result.transform || [];
        result.transform.push('rotateY(180deg)');
    }
    if (layer.isFlippedVertical) {
        result.transform = result.transform || [];
        result.transform.push('rotateX(180deg)');
    }
    if (layer.rotation) {
        result.transform = result.transform || [];
        result.transform.push(`rotate(${-1 * layer.rotation}deg)`);
    }

    if (!style) return result;
    if (style.contextSettings) {
        result.opacity = style.contextSettings.opacity;
    }
    if (style.borders) {
        style.borders.forEach((_border) => {
            if (_border.isEnabled) {
                if (layer._class == 'text') {
                    result.textStrokeWidth = _border.thickness;
                    result.textStrokeColor = colorParser(_border.color);
                } else {
                    result.borderColor = colorParser(_border.color);
                    result.borderWidth = _border.thickness;
                    result.borderStyle = 'solid';
                    result.borderPosition = _border.position;
                }

            }

        });
    }

   
    if (style.textStyle && attributedString && attributedString.archivedAttributedString) {
        const decodedAttributedString = parseArchive(attributedString.archivedAttributedString._archive);
        let encodedAttributes;
        let decodedNSColor;
        let decodedNSParagraphStyle;
        let decodedMSAttributedStringFontAttribute;
        if (style.textStyle.encodedAttributes) {
            encodedAttributes = style.textStyle.encodedAttributes;
            if (encodedAttributes.NSColor)
                decodedNSColor = parseArchive(encodedAttributes.NSColor._archive);
            if (encodedAttributes.NSParagraphStyle)
                decodedNSParagraphStyle = parseArchive(encodedAttributes.NSParagraphStyle._archive);
            if (encodedAttributes.MSAttributedStringFontAttribute)
                decodedMSAttributedStringFontAttribute = parseArchive(encodedAttributes.MSAttributedStringFontAttribute._archive);

        }

        if (decodedAttributedString.NSAttributes.NSColor && decodedAttributedString.NSAttributes.NSColor.NSRGB) {
            const colorArray = decodedAttributedString.NSAttributes.NSColor.NSRGB.toString().split(' ');
            const colors = {};
            colors.red = parseFloat(colorArray[0]);
            colors.green = parseFloat(colorArray[1]);
            colors.blue = parseFloat(colorArray[2]);

            if (colorArray.length > 3) {
                colors.alpha = parseFloat(colorArray[3]);
            }
            result.color = colorParser(colors);
        } else {
            result.color = result.color || '#000000';
        }

        if (decodedAttributedString.NSAttributes.MSAttributedStringFontAttribute) {
            let fontAttr = decodedAttributedString.NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes;
            result.fontSize = fontAttr.NSFontSizeAttribute;
            if(fontAttr.NSFontNameAttribute){
                result.fontFamily = fontAttr.NSFontNameAttribute;
            }
        }
        if (decodedMSAttributedStringFontAttribute) {
            result.fontSize = decodedMSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute;
            if(decodedMSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute){
                result.fontFamily = decodedMSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute;
            }
        }
        if (decodedAttributedString.NSAttributes.NSKern ){
            result.letterSpacing = decodedAttributedString.NSAttributes.NSKern;
        }
        if (encodedAttributes.NSKern ){
            result.letterSpacing = encodedAttributes.NSKern;
        }
        if (decodedAttributedString.NSAttributes.NSParagraphStyle) {
            const paragraphSpacing = decodedAttributedString.NSAttributes.NSParagraphStyle.NSParagraphSpacing;
            const maxLineHeight = decodedAttributedString.NSAttributes.NSParagraphStyle.NSMaxLineHeight;
            const minLineHeight = decodedAttributedString.NSAttributes.NSParagraphStyle.NSMinLineHeight;
            if (decodedAttributedString.NSAttributes.NSParagraphStyle.NSAlignment) {
                result.textAlign = decodedAttributedString.NSAttributes.NSParagraphStyle.NSAlignment;
            } else {
                result.textAlign = 0;
            }
            result.minLineHeight = minLineHeight;
            result.maxLineHeight = maxLineHeight;
            result.lineHeight = minLineHeight; //+ paragraphSpacing;
            result.paragraphSpacing = paragraphSpacing;
        }
        result.text = decodedAttributedString.NSString.split(/\n/g).join(`<div style="height:${util.px2rem(result.paragraphSpacing)}"></div>`);
    }else if(style.textStyle){
        try{
            const colorArray = style.textStyle.encodedAttributes.MSAttributedStringColorAttribute;
            const colors = {};
            colors.red = parseFloat(colorArray['red']);
            colors.green = parseFloat(colorArray['green']);
            colors.blue = parseFloat(colorArray['blue']);
            colors.alpha = parseFloat(colorArray['alpha']);
            result.color = colorParser(colors);
        }catch(e){
            result.color = result.color || '#000000';
        }
        try{
            let fontAttr=style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes
            result.fontSize = fontAttr.size;
            result.fontFamily = fontAttr.fontFamily;
        }catch(e){
            result.fontSize = fontAttr.size || '15px';
        }
        try{
            result.letterSpacing = style.textStyle.encodedAttributes.kerning;
            result.lineHeight = layer.frame.height
        }catch(e){
            result.letterSpacing = 0;
        }
        try{
            result.textAlign = style.textStyle.paragraphStyle.alignment;
        }catch(e){
            result.textAlign = 0;
        }
    }
    if (style.fills) {
        style.fills.forEach((fill) => {
            if (fill.isEnabled) {

                if (fill.image) {
                    result.backgroundImage = fill.image._ref;
                }
                if (fill.fillType === 1 || fill.fillType === 2) {
                    const gradient = fill.gradient;
                    const linearGradient = {};
                    linearGradient.gradientType = gradient.gradientType;
                    const from = util.toPoint(gradient.to);
                    from.x = from.x * layer.frame.width;
                    from.y = from.y * layer.frame.height;
                    const to = util.toPoint(gradient.from);
                    to.x = to.x * layer.frame.width;
                    to.y = to.y * layer.frame.height;
                    linearGradient.stops = [];
                    let angle = linearGradient.angle = Math.atan(to.x - from.x) / (to.y - from.y) * 180 / Math.PI;
                    let gradientLength = layer.frame.height / Math.cos(angle);
                    gradient.stops.forEach((stop) => {
                        const hex = util.color(stop.color);
                        const s = {
                            color: hex,
                            offset: 1 - stop.position
                        };
                        linearGradient.stops.push(s);

                    });
                    linearGradient.stops.reverse();
                    let beginLength = from.x * Math.sin(angle);
                    let endLength = beginLength + Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));

                    // console.log(from,to,gradientLength,beginLength,endLength,angle);
                    let beginStop = {
                        color: linearGradient.stops[0].color,
                        offset: beginLength / gradientLength
                    };
                    let endStop = {
                        color: linearGradient.stops[linearGradient.stops.length - 1].color,
                        offset: (endLength + beginLength) / gradientLength
                    };

                    linearGradient.stops.forEach((s) => {
                        s.offset = (s.offset ) * (endStop.offset - beginStop.offset) + beginStop.offset;
                    });
                    linearGradient.stops.unshift(beginStop);
                    linearGradient.stops.push(endStop);
                    result.linearGradient = linearGradient;
                    result.linearGradientString = `linear-gradient(${linearGradient.angle}deg, ${linearGradient.stops.map((s)=>{
                        return s.color + ' ' + (s.offset * 100) + '%';
                    }).join(',')})`;
                } else if (fill.fillType === 0) {
                    if (layer._class == 'text') {
                        result.color = colorParser(fill.color);
                    } else {
                        result.backgroundColor = colorParser(fill.color);
                    }
                }
            }
        });
    }
    if (layer.backgroundColor && layer.hasBackgroundColor) {
        result.backgroundColor = colorParser(layer.backgroundColor);
    }
    if (style.shadows) {
        style.shadows.forEach((shadow) => {
            if (shadow.isEnabled) {
                result.boxShadow = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${colorParser(shadow.color)}`;
            }
        });
    }
    return result;

};
function parseArchive (base64String) {
    const buf2 = Buffer.from(base64String, 'base64');
    const obj = bplistParser.parseBuffer(buf2);
    const parser = new NSArchiveParser();
    return parser.parse(obj);
}
module.exports = styleParser;