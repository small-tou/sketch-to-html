var util = {
    /**
     * 生成 rgba 颜色值
     * @param color
     * @returns {string}
     */
    color: function(color) {
        return `rgba(${parseInt(color.red * 255)},${parseInt(color.green * 255)},${parseInt(color.blue * 255)},${color.alpha})`;
    },
    /**
     * 是否正方形
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @returns {boolean}
     */
    isSquare: function (p1, p2, p3, p4) {

        let distSq = (p, q) => {
            return (p.x - q.x) * (p.x - q.x) +
              (p.y - q.y) * (p.y - q.y);
        };
        let d2 = distSq(p1, p2);  // from p1 to p2
        let d3 = distSq(p1, p3);  // from p1 to p3
        let d4 = distSq(p1, p4);  // from p1 to p4
        let s1 = distSq(p1, p2);
        let s2 = distSq(p2, p3);
        let s3 = distSq(p3, p4);
        let s4 = distSq(p4, p1);

        let allSidesSame = s1 === s2 && s2 === s3 && s3 === s4;
        // If lengths if (p1, p2) and (p1, p3) are same, then
        // following conditions must met to form a square.
        // 1) Square of length of (p1, p4) is same as twice
        //    the square of (p1, p2)
        // 2) p4 is at same distance from p2 and p3
        if (d2 == d3 && 2 * d2 == d4) {
            let d = distSq(p2, p4);
            return (d == distSq(p3, p4) && d == d2);
        }

        if (d3 == d4 && 2 * d3 == d2) {
            let d = distSq(p2, p3);
            return (d == distSq(p2, p4) && d == d3);
        }
        if (d2 == d4 && 2 * d2 == d3) {
            let d = distSq(p2, p3);
            return (d == distSq(p3, p4) && d == d2);
        }

        return false;
    },
    /**
     * 是否是正方形图层
     * @param layer
     * @returns {*}
     */
    isSqu: function (layer) {
        if (layer.path.points.length !== 4) {
            return false;
        }
        const rectPoints = layer.path.points.map(x => this.toPoint(x.point, layer));
        const isSquare = this.isSquare(rectPoints[0], rectPoints[1], rectPoints[2], rectPoints[3]);
        return isSquare;
    },
    /**
     * 是否是圆形
     * @param layer
     * @returns {boolean}
     */
    isCircle: function (layer) {
        if (!layer.path.points || layer.path.points.length !== 4) {
            return false;
        }
        const isSquare = this.isSqu( layer);
        const hasCurveTo = layer.path.points.filter(x => x.hasCurveTo === true).length === 4;
        if (isSquare && hasCurveTo) {
            return true;
        }
        return false;
    },
    /**
     * 是否是长方形
     * @param layer
     * @returns {*}
     */
    isRect(layer) {
        const path = layer.path;
        if (path.points.length !== 4) {
            return false;
        }
        const rectPoints = path.points.map(x => this.toPoint(x.point, layer));
        if (rectPoints.length === 4) {
            const isRect = this.IsRectangleAnyOrder(rectPoints[0], rectPoints[1], rectPoints[2], rectPoints[3]);
            const hasCurveTo = path.points.filter(x => x.hasCurveTo === true).length > 0;
            return isRect && !hasCurveTo;
        }
        return false;
    },
    IsRectangleAnyOrder(a, b, c, d) {
        return this.IsRectangle(a, b, c, d) || this.IsRectangle(b, c, a, d) || this.IsRectangle(c, a, b, d);
    },
    IsRectangle(a, b, c, d) {
        return this.IsOrthogonal(a, b, c) && this.IsOrthogonal(b, c, d) && this.IsOrthogonal(c, d, a);
    },
    IsOrthogonal(a, b, c) {
        return (b.x - a.x) * (b.x - c.x) + (b.y - a.y) * (b.y - c.y) === 0;
    },
    /**
     * 比例转换成具体位置
     * @param p
     * @param layer
     * @returns {{x: number, y: number}}
     */
    toPoint: function (p, layer) {
        let coords = { x: 0, y: 0 };
        let refWidth = 1;
        let refHeight = 1;
        if (layer) {
            refWidth = layer.frame.width;
            refHeight = layer.frame.height;
        }
        p = p.substring(1);
        p = p.substring(0, p.length - 1);
        p = p.split(',');

        return {
            x: Number(p[0].trim()) * refWidth,
            y: Number(p[1].trim()) * refHeight
        };
    },
    /**
     * 序列化 style
     * @param style
     * @returns {Array}
     */
    getStyleString(style) {
        let styleString = [];
        for (let i in style) {
            if (style[i] !== null && style[i] !== undefined ) {
                styleString.push(`${i}: ${style[i]}`);
            }
        }
        styleString = styleString.join(';');
        return styleString;
    },
    /**
     * 忽略 null 和 undefined 的 assign
     * @param target
     * @param source
     * @returns {{}}
     */
    assign(target, source){
        let result = {};
        for (let i in target) {
            if (target[i] !== undefined && target[i] !== null) {
                result[i] = target[i];
            }
        }
        for (let i in source) {
            if (source[i] !== undefined && source[i] !== null) {
                result[i] = source[i];
            }
        }
        return result;
    },
    px2rem(value){
        if (value) {
            value = value / 75;
            value = parseFloat(value).toFixed(6);
            return (value + 'rem');
        }
        return null;
    }

};

module.exports = util;