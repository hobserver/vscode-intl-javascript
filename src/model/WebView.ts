var uuid = require('node-uuid');
import { ExtensionContext, commands, window, ViewColumn, WebviewPanel } from "vscode";
import utils from '../utils/index';
import * as vscode from 'vscode';
import BaseErrorNode from "./BaseErrorNode";
import Parser from "./Parser";
import { WebviewListenerParams } from "../interface";
import SingleWebview from './SingleWebview';
class SidebarWebview {
    parser: Parser
    singleWebview: SingleWebview
    constructor(parser: Parser) {
        this.parser = parser;
        this.singleWebview = SingleWebview.getSingleInstance();
    }
    async open() {
        return await this.singleWebview.openWebview(this.parser);
    }
    triggerWebviewListener(method: string, params: any, callback?: any) {
        const id = uuid();
        this.sendMessage({
            id: id,
            listenerName: method,
            type: 'intl-js-vscode.triggerWebviewListener',
            params: params,
        });
        this.singleWebview.callbackCaches[id] = callback;
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
        this.singleWebview.panel?.webview.postMessage({
            filepath: this.parser.filepath,
            ...params
        });
    }
}
export default SidebarWebview;