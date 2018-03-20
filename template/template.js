
module.exports = function(html,layer) {
    return `<html>
<head>
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width,minimal-ui">
<link rel="stylesheet" href="./artboard-${layer.name}.css" type="text/css" />
<style>
html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}
</style>
</head>
<body >
${html}
<script>
(function(win) {
    var remCalc = {};
    var docEl = win.document.documentElement,
        tid;

    function refreshRem() {
        // 获取当前窗口的宽度
        var width = docEl.getBoundingClientRect().width;
        width = width * win.devicePixelRatio;
        // 大于640px 按640算
        if (width > 750) { width = 750 }
        var rem = width / 10;  // cms 只要把这行改成  var rem = width /640 * 100 
        docEl.style.fontSize = rem + "px";
        remCalc.rem = rem;
        //误差、兼容性处理
        var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
        if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
            var remScaled = rem * rem / actualSize;
            docEl.style.fontSize = remScaled + "px"
        }
    }

    //函数节流，避免频繁更新
    function dbcRefresh() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 100)
    }

    //窗口更新动态改变font-size
    win.addEventListener("resize", function() { dbcRefresh() }, false);

    //页面显示的时候再计算一次   难道切换窗口之后再切换来窗口大小会变?....
    win.addEventListener("pageshow", function(e) {
        if (e.persisted) { dbcRefresh() }
    }, false);
    refreshRem();
    remCalc.refreshRem = refreshRem;
    remCalc.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === "string" && d.match(/rem$/)) { val += "px" }
        return val
    };
    remCalc.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === "string" && d.match(/px$/)) { val += "rem" }
        return val
    };
    win.remCalc = remCalc
})(window);

</script>
</body>
</html>`;
};
