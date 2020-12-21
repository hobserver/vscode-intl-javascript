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
            }
        ],
        plugins: [
            // 参考内网文档：https://yuque.alibaba-inc.com/dataworks-sqi/sgxghg/eic2ec
            [require.resolve('@ali/vscode-intl-javascript-plugin-mds'), {
                mdsProjectName: 'only-dataservice',
                exportLangs: 'zh_CN,en_US,zh_TW'
            }],
            new ReactIntlUniversal({
                defaultLang: 'zh_CN',
                defaultFuncNameReg: /d/,
                getFuncNameReg: /get|getHTML/
            }),
            new ReactBabel(),
        ]
    }
}