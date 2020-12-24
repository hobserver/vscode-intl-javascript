import Parser from "../../model/Parser";
export default function initApiJs({webViewHooks}: Parser) {
    webViewHooks.jsHook.tapPromise('apiJs', async (jsArr: string[]) => {
        return jsArr.concat([`
<script type="text/javascript">
const vscode = acquireVsCodeApi();
window.parentCallbacks = {};
window.webviewListener = {};
function triggerParentListener(listenerName, params, callback) {
    const id = uuidv4();
    vscode.postMessage({
        filepath: window.globalParserFilePath,
        id: id,
        type: 'intl-js-vscode.triggerParentListener',
        listenerName: listenerName,
        params,
    });
    window.parentCallbacks[id] = callback;
}
</script>
        `]);
    });
}