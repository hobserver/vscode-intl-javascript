const ReactBabel = require('vscode-intl-javascript/out/plugins/react');
const ReactIntlUniversal = require('vscode-intl-javascript/out/plugins/react-intl-universal');
const path = require('path');
const intl = require('react-intl-universal');
module.exports = (parser) => {
    return {
        langs: [
            {
                key: 'zh_CN',
                name: '中文简体'
            },
            {
                key: 'en_US',
                name: '英文'
            }
        ],
        plugins: [
            new ReactIntlUniversal({
                defaultLang: 'zh_CN',
                defaultFuncNameReg: /d/,
                getFuncNameReg: /get|getHTML/
            }),
            new ReactBabel()
        ]
    }
}