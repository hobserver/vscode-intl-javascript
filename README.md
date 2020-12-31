# How to use it
Search vscode-intl-javascript in vscode Market, then install it

# Simple start (react)
## create config file in project dir
intl.config.js
## install package 
npm install vscode-intl-javascript react-intl-universal --save-dev
## write config content
```
const ReactBabel = require('vscode-intl-javascript/out/plugins/react');
const ReactIntlUniversal = require('vscode-intl-javascript/out/plugins/react-intl-universal');
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
```
# Example
[example](https://github.com/hobserver/vscode-intl-javascript-example)


# Usage display
## basic usage
![basic usage](https://img.alicdn.com/imgextra/i4/O1CN018tbMyv1bN3rgb47hv_!!6000000003452-1-tps-1193-667.gif)
## replace already key
![replace already key](https://img.alicdn.com/imgextra/i3/O1CN01Wzdcwp1HHIZEReUAK_!!6000000000732-1-tps-1193-667.gif)
## replace no right key
![replace no right key](https://img.alicdn.com/imgextra/i1/O1CN01BIef8z1HGqAaFO251_!!6000000000731-1-tps-1193-667.gif)
## replace no right value
![replace no right value](https://img.alicdn.com/imgextra/i4/O1CN014F38Fb255bEsEujus_!!6000000007475-1-tps-1193-667.gif)
## batch check dir
![batch check dir](https://img.alicdn.com/imgextra/i1/O1CN01TVn2nk1z8S0eceaXr_!!6000000006669-1-tps-1343-915.gif)

# Framework
![Framework](https://img.alicdn.com/imgextra/i4/O1CN01yL46C41LQElDcb20I_!!6000000001293-2-tps-1452-1090.png)

# Config
## langs [array]
```
{
    key: LangKey, // International file name
    name: string, // Prompt text
    color: string, // Prompt color when conditions are not met
    check: boolean, // Whether to skip batch detection
}[]
type LangKey = 'zh_CN' | 'en_US' | 'zh_TW';
```
## localeDir
International file storage location

## plugins
### plug in mode 1
```
class ReactIntlUniversal {
    apply(parser) {
        // ...
    }
}
new ReactIntlUniversal({
    defaultLang: 'zh_CN',
    defaultFuncNameReg: /d/,
    getFuncNameReg: /get|getHTML/
})
```
### plug in mode 2
```
// npm package : vscode-intl-javascript-plugin-XXX
export default class ReactIntlUniversal {
    apply(parser) {
        // ...
    }
}

[require.resolve('vscode-intl-javascript-plugin-XXX'), {
    optionA: 'XXX',
}]
```
# How to write a plugin
clone plugin template from github [vscode-intl-javascript-plugin-template](https://github.com/hobserver/vscode-intl-javascript-plugin-template)
```
// just reference the code in src/plugins
export default class {
    apply(parser) {
        //...
    }
}
```

# Parser API
## filepath
current parse file path
## babelHooks
### babelPresetHook [SyncWaterfallHook]
```
export default class {
    apply(parser) {
        parser.babelHooks.babelPresetHook.tap((presets) => {
            return presets.concat([...]);
        })
    }
}
```
### babelPluginHook [SyncWaterfallHook]
## webViewHooks
```
public webViewHooks: {
    htmlHook: AsyncSeriesWaterfallHook<[string]>, // webview html content
    titleHook: AsyncSeriesWaterfallHook<[string]>, // webview title
    headHook: AsyncSeriesWaterfallHook<[string[]]>, // webview head tag list
    jsHook: AsyncSeriesWaterfallHook<[string[]]>, // webview head javascript tag list
    metaHook: AsyncSeriesWaterfallHook<[string[]]>, // webview head meta tag list
    cssHook: AsyncSeriesWaterfallHook<[string[]]>, // webview css tag list
    bodyHtmlHook: AsyncSeriesWaterfallHook<[string[]]>, // webview body html list
    btnHook: AsyncSeriesWaterfallHook<[string[]]>, // webview button list
    bodyHeaderJsHook: AsyncSeriesWaterfallHook<[string[]]>,// webview body jsvascript list, before </body>
    bodyFooterJsHook: AsyncSeriesWaterfallHook<[string[]]>, // webview body jsvascript list, after <body>
    listenerHook: AsyncSeriesWaterfallHook<[WebviewListenerParams[]]>, // webview listener callback list
    sendLangInfoHook: AsyncSeriesWaterfallHook<[MessageInfoSendParams, BaseErrorNode, Parser?]>, // webview postmessage params
    vueHooks: {
        createdHook: AsyncSeriesWaterfallHook<[string[][]]>, // webview vue create event callbacks
        methodsHook: AsyncSeriesWaterfallHook<[WebviewListenerParams[]]>, // webview vue methods property
    }
}
```
## intlStorage
```
updateKeyInLang(param: UpdateParam): void;
checkKeyInLang(key: string, lang: LangKey, text?: string): {
    exist: boolean;
    ananimous: boolean;
};
getValueKeyInLang(value: string, lang: LangKey): string | null;
checkKey(key: string, text?: string): CheckResult;
getValueKey(value: string): CheckResult;
storeKeyAndValues(addParams: StorageAddParams[]): Promise<void>;
writeLangKeysToFile(langLey: LangKey, keys: {
    [key: string]: string;
}, isWhoile?: boolean): void;
storeKeyAndValue(addParam: StorageAddParams): void;
getKeyInLang(key: string, lang: LangKey): string;
```
## config
```
localeDir: string
getFirstLangKey(): LangKey;
getTempDir(configFile: string | null): Promise<string>; // temp file dir
```
## register new service
```
registerService(serviceName: keyof ParserService, serviceObj: any): void;
getService<T extends keyof ParserService>(serviceName: T): ParserService[T];
```

# Plugin list
## built-in plugins
### react babel parser plugin
```
const ReactBabel = require('vscode-intl-javascript/out/plugins/react');
// file: intl.config.js
plugins: [
    new ReactIntlUniversal({
        defaultLang: 'zh_CN',
        defaultFuncNameReg: /d/,
        getFuncNameReg: /get|getHTML/
    }),
    new ReactBabel(),
]
```
### react-intl-universal
```
const ReactIntlUniversal = require('vscode-intl-javascript/out/plugins/react-intl-universal');
// file: intl.config.js
plugins: [
    new ReactIntlUniversal({
        defaultLang: 'zh_CN',
        defaultFuncNameReg: /d/,
        getFuncNameReg: /get|getHTML/
    }),
    new ReactBabel(),
]
```
## other plugins
### alibaba(It can only be used inside the company)
- [@ali/vscode-intl-javascript-plugin-mds](https://npm.alibaba-inc.com/package/@ali/vscode-intl-javascript-plugin-mds)

# plan
- [ ] vue plugin
- [ ] angular plugin
- [ ] more hooks
# communication
group dingding(钉钉群): 32965438
