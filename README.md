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
```

> 这个库刚开发出来，用起来还不太优雅，呵呵

## 优势
相比 github 上其他的库，特别支持以下特性：

* 更好的处理各种旋转变形属性
* 支持形状内填充图案
* 完整支持渐变色
* 支持 mask 蒙层
* 支持 icon 图片变色
* 支持渐变 mask 蒙层
* css 和 html 分离
* 生成中间数据结构，可以支持转成其他框架视图
* 更完善处理文字排版
* 支持所有图层类型转换，不规则图形转成 svg
* 使用 rem 方案生成页面，支持自动缩放

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
