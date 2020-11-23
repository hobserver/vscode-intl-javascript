const babelCore = require('@babel/core');
function getNodeValue (node) {
    var value = '';
    if (node.type === 'TemplateElement') {
        value = node.value.raw;
    } else {
        value = node.value
    }
    return value.trim()
}
babelCore.transformFile('/Users/rongping/Documents/code/only-dataservice/src/components/CommonTree/action.ts', {
    presets: [
        // [
        //     require.resolve('@babel/preset-env'),
        //     {
        //         "useBuiltIns": false,
        //         // "corejs": 3
        //     }
        // ],
        require.resolve('@babel/preset-react'),
        require.resolve('@babel/preset-typescript')
    ],
    "plugins": [
        {
            visitor: {
                JSXText: (nodePath) => {
                    // this.checkNode(nodePath, errors);
                },
                StringLiteral: (nodePath) => {
                    let nodeValue = getNodeValue(nodePath.node);
                    if (
                        /[\u4e00-\u9fa5]/.test(nodeValue)
                    ) {
                        console.log(nodeValue, '=--=-='); 
                    // this.checkNode(nodePath, errors);
                    }
                },
                TemplateElement: (nodePath) => {
                    // this.checkNode(nodePath, errors);
                },
            }
        },
        [
            require.resolve("@babel/plugin-proposal-decorators"),
            {
                legacy: true
            }
        ],
        require.resolve("@babel/plugin-proposal-class-properties")
    ]
}, (err) => {
    if (err) {
        vscode.window.showWarningMessage(`${this.filepath} - Babel解析失败` + err.stack);
    } else {
    }
});