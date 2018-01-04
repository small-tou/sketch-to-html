const pathParser = function (layer) {
    if(!layer.path) {
        return null;
    }
    let path = layer.path;
    let {x, y} = getXY(path.points[0].point,layer);
    let ret = `M${toS(x)},${toS(y)}`;
    let n = path['isClosed'] ? path.points.length + 1 : path.points.length;
    for (let i = 1; i < n; ++i) {
        let now = i;
        if (now === path.points.length) {
            now = 0;
        }
        let prev = (i - 1);
        let {x: x1, y: y1} = getXY(path.points[prev].curveFrom,layer);
        let {x: x2, y: y2} = getXY(path.points[now].curveTo,layer);
        let {x, y} = getXY(path.points[now].point,layer);
        if (!path.points[now].hasCurveTo && !path.points[now].hasCurveFrom){
            ret += `L${toS(x)},${toS(y)}`;
        }else {
            ret += `C${toS(x1)},${toS(y1)} ${toS(x2)},${toS(y2)} ${toS(x)},${toS(y)}`;
        }
    }

    if (path['isClosed']) {
        ret += 'Z';
    }
    return ret;
}
function toS(a){
    return Number(a).toFixed(6).replace(/\.?0+$/,'');
}

function s2p(s) {
    let [x, y] = s.substr(1, s.length - 2).split(',').map(Number);
    return {x, y}
}
function getXY(s,layer) {
    let {x, y} = s2p(s);
    x = layer.frame.width * x;
    y = layer.frame.height * y;
    return {x, y}
}
module.exports = pathParser;