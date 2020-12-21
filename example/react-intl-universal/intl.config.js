const ReactBabel = require('vscode-intl-javascript/out/plugins/react');
const ReactIntlUniversal = require('vscode-intl-javascript/out/plugins/react-intl-universal');
const path = require('path');
const intl = require('react-intl-universal');
module.exports = (parser) => {
    return {
        langs: [
            {
                key: 'zh_CN',
                name: intl.get('intl.config848771742').d('的')
            },
            {
                key: 'en_US',
                name: 'sdfsd你好a1111111'
            }
        ],
        plugins: [
            [require.resolve('vscode-intl-javascript-plugin-template'), {

            }],
            new ReactIntlUniversal({
                defaultLang: 'zh_CN',
                defaultFuncNameReg: /d/,
                getFuncNameReg: /get|getHTML/
            }),
            new ReactBabel()
        ]
    }
}