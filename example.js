const source = './ooto.sketch';
const fse = require('fs-extra');

var parser = require('./index')
parser(source)

fse.copy('./output/html', './docs', err => {
});