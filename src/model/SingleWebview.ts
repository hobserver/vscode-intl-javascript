var uuid = require('node-uuid');
import { ExtensionContext, commands, window, ViewColumn, WebviewPanel } from "vscode";
import utils from '../utils/index';
import Parser from "./Parser";
import ParserManger from "./ParserManager";
class SingleWebview {
    static instance: SingleWebview
    callbackCaches: {
        [callbackName: string]: (...args: any[]) => any
    } = {}
    webviewReady = false;
    panel?: WebviewPanel;
    // @ts-ignore
    parser: Parser;
    static getSingleInstance(): SingleWebview {
        if (SingleWebview.instance) {
            return SingleWebview.instance;
        }
        SingleWebview.instance = new SingleWebview();
        return SingleWebview.instance;
    }
    async openWebview(parser: Parser) {
        this.parser = parser;
        this.webviewReady = false;
        if (!this.panel) {
            this.panel = window.createWebviewPanel(
                'transView',
                '上传到服务器',
                ViewColumn.Beside,
                {
                    enableCommandUris: true,
                    enableScripts: true
                }
            );
            this.panel.onDidDispose((webview: any) => {
                this.panel = undefined;
                this.webviewReady = false;
            });
            this.panel?.onDidChangeViewState((webview: any) => {
                if (webview.webviewPanel.active) {
                    // resolve();
                }
            });
            const {webview} = this.panel;
            webview.onDidReceiveMessage(this.onMessage.bind(this));
        }
        if (utils.extension) {
            const {webview} = this.panel;
            parser?.webViewHooks.jsHook.tapPromise('globalFilePath', async (jsArr: string[]) => {
                return jsArr.concat([
                    `
                    <script>
                        window.globalParserFilePath = '${parser.filepath}';
                    </script>
                    `
                ]);
            });
            webview.html = '';
            const html = await parser?.webViewHooks.htmlHook.promise('');
            webview.html = html as string;
            await new Promise(resolve => {
                var _run = () => {
                    setTimeout(() => {
                        if (!this.webviewReady) {
                            _run();
                        } else {
                            resolve(null);
                        }
                    }, 60);
                }
                _run();
            });
        } else {
            return Promise.reject();
        }
    }
    sendMessage(params: any) {
        this.panel?.webview.postMessage(params);
    }
    onMessage(data: any) {
        const { listenerName, id, type, params, filepath } = data;
        if (type === 'intl-js-vscode.triggerParentListener') {
            const parser = ParserManger.getSingleInstance().caches[filepath];
            parser?.processListenerHook.get(listenerName)?.promise(params).then(async () => {
                this.sendMessage({
                    id,
                    type: 'intl-js-vscode.webview_callback',
                    params: {}
                });
            });
        } else if (type === 'intl-js-vscode.parent_callback') {
            if (this.callbackCaches[id]) {
                this.callbackCaches[id](params);
            }
        } else if (type === 'intl-js-vscode.document_ready') {
            this.webviewReady = true;
        }
    }
}
export default SingleWebview;