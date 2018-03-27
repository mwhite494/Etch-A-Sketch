console.log('-------Copying sketch.min.js file-------');
var fs = require('fs');
fs.createReadStream('node_modules/sketch-js/js/sketch.min.js').pipe(fs.createWriteStream('public/sketch.min.js'));
console.log('-------          !Done!          -------');
