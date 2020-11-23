// const vm = require('vm');
// const path = require('path');
// const fs = require('fs');
// var tsc = path.join(path.dirname(require.resolve("typescript")), "tsc.js");
// var tscScript = new vm.Script(fs.readFileSync(tsc, "utf8"));
// var sandbox = {
//     process: {
//         ...process,
//         argv: [
//             '/Users/rongping/Documents/code/intl-vscode/intl-vscode/demo/intl.config.ts'
//         ],
//     },
//     require: require,
//     module: module,
//     setTimeout: setTimeout,
//     clearTimeout: clearTimeout,
//     __filename: tsc
// };
// vm.createContext(sandbox);
// tscScript.runInNewContext(sandbox);