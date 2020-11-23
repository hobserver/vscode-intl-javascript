var vm = require("vm");
var fs = require("fs");
var path = require("path");
var tsc = path.join(path.dirname(require.resolve("typescript")), "tsc.js");
var tscScript = vm.createScript(fs.readFileSync(tsc, "utf8"), tsc);