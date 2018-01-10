# sketch to html

## 使用

安装：

```javascript
npm install sketch-to-html --save
```

引入并解析：

```javascript
const source = './xxx.sketch';

const parser = require('sketch-to-html');
parser(source);
// 会输出一个网站资源文件夹到当前文件夹下的 output 文件夹中，并且尝试用系统的 chrome 打开页面。
```

> 这个库刚开发出来，用起来还不太优雅，呵呵，这里只是提供一种演示，后续会开拓一些实用功能

运行示例：

```
git clone https://github.com/xinyu198736/sketch-to-html.git
cd sketch-to-html
npm install
npm run example
```

在线查看生成的 html 示例：

[https://xinyu198736.github.io/sketch-to-html/docs/index.html](https://xinyu198736.github.io/sketch-to-html/docs/index.html)

## 优势

相比 github 上其他的库，特别支持以下特性：

* 更好的处理各种旋转变形属性
* 支持形状内填充图案
* 完整支持渐变色
* 支持 mask 蒙层
* 支持 icon 图片变色
* 支持渐变 mask 蒙层
* 生成的页面 css 和 html 分离
* 生成中间数据结构，可以支持转成其他框架视图
* 更完善处理文字排版
* 支持所有图层类型转换，不规则图形转成 svg
* 使用 rem 方案生成页面，支持自动缩放

## 已知问题（逐步修复中）

* 渐变色的角度算法有问题，算出来的值有偏差，并且横向的角度会算成无限大
* 对于 Group 的 shadow 处理有问题，css 不支持轮廓 shadow
* 蒙层在蒙层参照物是 不规则图形时 会失效。

## todo

* 支持在 px 和 rem 之间切换
* 支持在设计稿中标注一些 html 属性，例如链接地址（可行性未评估好）
* 支持复用一些知名组件库，并且可以根据内容导出成组件的属性。

## 结构

```bash
├── README.md
├── example.js                 示例
├── index.js                   入口
├── layer                      所有图层类型的样式和结构生成方法
│   ├── Bitmap.js
│   ├── Common.js
│   ├── Group.js
│   ├── Layer.js
│   ├── ShapeGroup.js
│   └── ShapePath.js
├── package.json
├── parser                     一些用来做解析的方法
│   ├── NSArchiveParser.js
│   ├── colorParser.js
│   ├── layerParser.js
│   ├── pathParser.js
│   └── styleParser.js
├── render                     生成样式表和渲染html的方法
│   ├── htmlRender.js
│   └── styleRender.js
├── store                      全局的数据存储
│   ├── StyleStore.js
│   └── SymbolStore.js
├── template                   模板
│   ├── index.html
│   ├── index.js
│   └── template.js
└── util.js                    工具方法
```
## 中间转换的数据结构

转换原理是将 sketch 文件先转为一个大的数据结构，然后遍历此数据结构生成 html 和 css，以下是数据结构的示例，后续可以从此数据结构生成其他语言的代码。

```javascript
{
    "id": "E42E1F7C-C8AB-47F4-A131-22C31284ADC4",
    "frame": {
        "_class": "rect",
        "constrainProportions": false,
        "height": 50,
        "width": 197,
        "x": 250,
        "y": 876
    },
    "style": {},
    "path": null,
    "isVisible": true,
    "name": "Group_12",
    "type": "group",
    "isMask": false,
    "childrens": [
        {
            "id": "B06A6329-E18B-4036-80EB-9E05384FB991",
            "frame": {
                "_class": "rect",
                "constrainProportions": false,
                "height": 49.99999999999998,
                "width": 197,
                "x": 0,
                "y": 0
            },
            "style": {
                "backgroundColor": "rgba(239,119,149,1)"
            },
            "path": null,
            "isVisible": true,
            "name": "Rectangle_3_5",
            "type": "shapeGroup",
            "isMask": false,
            "childrens": [
                {
                    "id": "EBC7DA72-D642-42FF-8F46-DF6F96E47CEB",
                    "frame": {
                        "_class": "rect",
                        "constrainProportions": false,
                        "height": 49.99999999999998,
                        "width": 196.9999999999999,
                        "x": 0,
                        "y": 0
                    },
                    "style": {
                        "borderRadius": 100
                    },
                    "path": "M0,0L197,0L197,50L0,50L0,0Z",
                    "isVisible": true,
                    "name": "Path_19",
                    "type": "rectangle",
                    "isMask": false,
                    "isRect": true
                }
            ]
        },
        {
            "id": "69C0B6EF-A15F-409F-B2BC-744B6F479D42",
            "frame": {
                "_class": "rect",
                "constrainProportions": false,
                "height": 33,
                "width": 153.8478260869566,
                "x": 21.15217391304342,
                "y": 6.999999999999989
            },
            "style": {
                "color": "rgba(255,254,254,1)",
                "fontSize": 24,
                "textAlign": 2,
                "text": "斩获无数大奖"
            },
            "path": null,
            "isVisible": true,
            "name": "zhan_huo_wu_shu_da_jiang",
            "type": "text",
            "isMask": false,
            "text": "斩获无数大奖"
        }
    ]
}
```