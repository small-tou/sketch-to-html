/**
"alpha": 1,
"blue": 0.8509803921568627,
"green": 0.8509803921568627,
"red": 0.8509803921568627

*/

const colorParser = function(color) {
	return `rgba(${parseInt(color.red*255)},${parseInt(color.green*255)},${parseInt(color.blue*255)},${color.alpha||1})`
}
module.exports = colorParser;