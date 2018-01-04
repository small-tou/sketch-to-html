const colorParser = require('./colorParser');
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
        /**
         {
             "_class": "border",
             "isEnabled": false,
             "color": {
                 "_class": "color",
                 "alpha": 1,
                 "blue": 0.592,
                 "green": 0.592,
                 "red": 0.592
             },
             "fillType": 0,
             "position": 1,
             "thickness": 1
         }
         */
        style.borders.forEach((_border) => {
            if (_border.isEnabled) {
                if (layer._class == 'text') {
                    result.textStrokeWidth = _border.thickness;
                    result.textStrokeColor = colorParser(_border.color);
                } else {
                    result.borderColor = colorParser(_border.color);
                    result.borderWidth = _border.thickness;
                    result.borderStyle = 'solid';
                }

            }

        });
    }


    if (style.textStyle) {
        const decodedAttributedString = parseArchive(attributedString.archivedAttributedString._archive);
        // item.decodedTextAttributes = decodedAttributedString;
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
            // result.opacity = 1;
        }
        if (decodedAttributedString.NSAttributes.MSAttributedStringFontAttribute) {
            result.fontSize = decodedAttributedString.NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute;
        }
        if (decodedMSAttributedStringFontAttribute) {
            result.fontSize = decodedMSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute;
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


            // data.$$paragraphSpacing = paragraphSpacing;
            result.minLineHeight = minLineHeight;
            result.maxLineHeight = maxLineHeight;
            result.lineHeight = minLineHeight; //+ paragraphSpacing;
            result.paragraphSpacing = paragraphSpacing;
            // result.marginTop = -1 * paragraphSpacing / 2;

        }
        result.text = decodedAttributedString.NSString.split(/\n/g).join(`<div style="height:${util.pxvalue(result.paragraphSpacing)}"></div>`);


        // if(layer.frame.height > result.fontSize * 1.5) {
        //     result.lineHeight = result.lineHeight || result.fontSize
        // } else {
        //     result.lineHeight = result.lineHeight || layer.frame.height;
        // }
    }
    if (style.fills) {
        /**
         {
             "_class": "fill",
             "isEnabled": true,
             "color": {
                 "_class": "color",
                 "alpha": 1,
                 "blue": 0.8509803921568627,
                 "green": 0.8509803921568627,
                 "red": 0.8509803921568627
             },
             "fillType": 0,
             "noiseIndex": 0,
             "noiseIntensity": 0,
             "patternFillType": 0,
             "patternTileScale": 1
         }
         */
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
                    // linearGradient.x1 = from.x * 100 + '%';
                    // linearGradient.x2 = to.x * 100 + '%';
                    // linearGradient.y1 = from.y * 100 + '%';
                    // linearGradient.y2 = to.y * 100 + '%';
                    linearGradient.stops = [];
                    // linearGradient.isLinearGradient = true;
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
                    // linearGradient.stops.reverse();

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
    if (layer.backgroundColor) {
        result.backgroundColor = colorParser(layer.backgroundColor);
    }
    if (style.shadows) {
        style.shadows.forEach((shadow) => {
            if (shadow.isEnabled) {
                result.boxShadow = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.spread}px ${colorParser(shadow.color)}`;
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