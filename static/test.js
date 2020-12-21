const path = require('path');
var f = path.dirname('/Users/rongping/Documents/code/intl-vscode/intl-vscode/static/test.js');
console.log(path.basename('/Users/rongping/Documents/code/intl-vscode/intl-vscode/static/test.js').str);
const dd = path.relative('/Users/rongping/Documents/code/intl-vscode/intl-vscode', f);
console.log(dd);