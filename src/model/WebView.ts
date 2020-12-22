var uuid = require('node-uuid');
import { ExtensionContext, commands, window, ViewColumn, WebviewPanel } from "vscode";
import utils from '../utils/index';
import * as vscode from 'vscode';
import BaseErrorNode from "./BaseErrorNode";
import Parser from "./Parser";
import { WebviewListenerParams } from "../interface";
class SidebarWebview {
    static instance: SidebarWebview;
    static getSingleInstance (parser: Parser) {
        if (SidebarWebview.instance) {
            return SidebarWebview.instance;
        }
        SidebarWebview.instance = new SidebarWebview(parser);
        return SidebarWebview.instance;
    }
    callbackCaches: {
        [callbackName: string]: (...args: any[]) => any
    } = {}
    webviewReady = false;
    panel?: WebviewPanel;
    parser: Parser
    constructor(parser: Parser) {
        this.parser = parser;
    }
    async open() {
        if (this.panel) return;
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
        });
        const {webview} = this.panel;
        if (utils.extension) {
            const html = await this.parser?.webViewHooks.htmlHook.promise('');
            webview.html = html as string;
            webview.onDidReceiveMessage(this.onMessage.bind(this));
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
            this.panel?.onDidChangeViewState((webview: any) => {
                if (webview.webviewPanel.active) {
                    // resolve();
                }
            });
            this.panel?.onDidDispose((webview: any) => {
                this.panel = undefined;
                this.webviewReady = false;
            });
        } else {
            return Promise.reject();
        }
    }
    triggerWebviewListener(method: string, params: any, callback?: any) {
        const id = uuid();
        this.sendMessage({
            id: id,
            listenerName: method,
            type: 'intl-js-vscode.triggerWebviewListener',
            params: params,
        });
        this.callbackCaches[id] = callback;
    }
    sendErrorNode(errorNode: BaseErrorNode) {
        this.triggerWebviewListener('onErrorNode', errorNode);
    }
    addWebviewListener(name: string, functionConstructorParams: string[]) {
        this.parser?.webViewHooks.listenerHook.tapPromise(name, async (listeners: WebviewListenerParams[]) => {
            return listeners.concat([
                {
                    name,
                    functionConstructorParams
                }
            ]);
        });
    }
    addParentListener(name: string, func: (...args: any[]) => any) {
        this.parser.processListenerHook.for(name).tapPromise(name, async (...args: any) => {
            func(...args);
        });
    }
    sendMessage(params: any) {
        this.panel?.webview.postMessage(params);
    }
    onMessage(data: any) {
        const { listenerName, id, type, params } = data;
        if (type === 'intl-js-vscode.triggerParentListener') {
            this.parser.processListenerHook.get(listenerName)?.promise(params).then(async () => {
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
export default SidebarWebview;