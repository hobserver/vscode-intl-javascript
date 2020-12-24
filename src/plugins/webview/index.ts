import Parser from '../../model/Parser';
import * as vscode from 'vscode';
import utils from '../../utils/index';
import initBodyHtml from './bodyHtml';
import initApiJs from './webviewApi';
import * as path from 'path';
var template = require('art-template');
export default class WebViewPlugin {
    options
    constructor(options?: any) {
        this.options = options;
    }
    initWebviewApi(parser: Parser) {
        parser.webview.addParentListener('errorNodeReplace', (params) => {
        });
    }
    getStaticFileSrc(parser: Parser, filepath: string): vscode.Uri {
        const onDiskPath = vscode.Uri.file(filepath);
        // @ts-ignore
        return parser?.webview.singleWebview.panel?.webview.asWebviewUri(onDiskPath);
    }
    async apply(parser: Parser) {
        this.initWebviewApi(parser);
        const {webViewHooks, webview} = parser;
        webview.addWebviewListener('onErrorNode', [
            'errorInfo',
            'this.form = errorInfo;'
        ]);
        webViewHooks.titleHook.tapPromise('title', async (title: string) => {
            return '我可以配置的哦'
        });
        initApiJs(parser);
        webViewHooks.jsHook.tapPromise('jss', async (jsArr: string[]) => {
            console.log([
                `<script src="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/js/uuidv4.js'))}"></script>`,
                `<script src="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/js/vue.js'))}"></script>`,
                `<script src="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/js/element.js'))}"></script>`,
                `<style type="type/css">
                    .input {
                        width: 100%;
                    }
                </style>`
            ]);
            return jsArr.concat([
                `<script src="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/js/uuidv4.js'))}"></script>`,
                `<script src="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/js/vue.js'))}"></script>`,
                `<script src="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/js/element.js'))}"></script>`,
                `<style type="type/css">
                    .input {
                        width: 100%;
                    }
                </style>`
            ]);
        });
        webViewHooks.cssHook.tapPromise('css', async (cssArr: string[]) => {
            return cssArr.concat([
                `<link rel="stylesheet" href="${this.getStaticFileSrc(parser, path.join(__dirname, '../../../static/css/vue.css'))}">`
            ]);
        });
        webViewHooks.metaHook.tapPromise('meta', async (metaArr: string[]) => {
            return metaArr;
        });
        webViewHooks.headHook.tapPromise('headers', async (header: string[]) => {
            var jsArr = await webViewHooks.jsHook.promise([]);
            var cssArr = await webViewHooks.cssHook.promise([]);
            var metaArr = await webViewHooks.metaHook.promise([]);
            return metaArr.concat(jsArr).concat(cssArr);
        });
        initBodyHtml(parser);
        webViewHooks.htmlHook.tapPromise('htmlFile', async (html: string) => {
            const headers = await webViewHooks.headHook.promise([]);
            const title = await webViewHooks.titleHook.promise('');
            const body = await webViewHooks.bodyHtmlHook.promise([]);
            var htmlData: string = await vscode.workspace.fs.readFile(
                vscode.Uri.file(path.join(utils.extension.extensionPath, 'static/index.html'))
            ).then(data => {
                return data.toString();
            });
            return template.render(htmlData, {
                title: title,
                headers: headers.join('\n'),
                body: body.join('\n'),
            }, {
            });
        });
    }
}