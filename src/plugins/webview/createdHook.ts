import { WebviewListenerParams } from "../../interface";
import Parser from "../../model/Parser";
export default function initBodyCreateJs({webViewHooks, webview}: Parser) {
    webViewHooks.vueHooks.createdHook.tapPromise('webviewListener', async (createds: string[][]) => {
        const listeners = await webViewHooks.listenerHook.promise([]);
        return createds.concat([
            [
                `
                var webviewListenerArr = ${JSON.stringify(listeners, null, 4)};
                webviewListenerArr.forEach(item => {
                    window.webviewListener[item.name] = new Function(...item.functionConstructorParams);
                });
                `
            ]
        ]);
    });
    webViewHooks.vueHooks.createdHook.tapPromise('webviewListeneEvent', async (createds: any[]) => {
        return createds.concat([
            [
                'app',
                `
                window.addEventListener('message', (data) => {
                    const { listenerName, id, type, params } = data.data;
                    if (type === 'intl-js-vscode.triggerWebviewListener') {
                        if (window.webviewListener[listenerName]) {
                            window.webviewListener[listenerName].call(app, params, (callbackParams) => {
                                vscode.postMessage({
                                    type: 'intl-js-vscode.parent_callback',
                                    id: id,
                                    params: callbackParams
                                });
                            });
                        }
                    } else if (type === 'intl-js-vscode.webview_callback') {
                        if (window.parentCallbacks[id]) {
                            window.parentCallbacks[id](params);
                        }
                    }
                });
                `
            ]
        ]);
    });
    webViewHooks.vueHooks.createdHook.tapPromise('ready', async (jsArr: string[][]) => {
        return jsArr.concat([
            [
                `
                setTimeout(() => {
                    vscode.postMessage({
                        type: 'intl-js-vscode.document_ready',
                    });
                }, 0);
                `
            ]
        ]);
    });
}