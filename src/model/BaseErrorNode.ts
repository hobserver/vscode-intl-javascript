import {ErrorNodeParam, MessageInfoSendParams,
    HoverCommandMenuItem, HoverParams,
    LangKey, MessageInfoResParams,
    StorageAddParams, HoverMenuCommandParam} from '../interface';
import * as vscode from 'vscode';
import Parser from './Parser';
var uuid = require('node-uuid');
var md5 = require('md5');
 
import * as fs from 'fs';
import { Commands } from '../constants/command';
export default class {
    isRight = true
    id: string
    parser: Parser
    filepath: string
    start: number
    end: number
    startRow: number
    startCol: number
    endRow: number
    endCol: number
    constructor({
        parser,
        filepath,
        start,
        end,
        startRow,
        startCol,
        endRow,
        endCol
    }: ErrorNodeParam) {
        this.parser = parser;
        this.filepath = filepath;
        this.start = start;
        this.end = end;
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        this.id = md5(this.filepath + this.start + this.end);
    }
    registerCommand(commandId: string, callback: ({errorNodeId}: HoverMenuCommandParam) => void) {
        const commandSerivce = this.parser.getService('hoverMenuCommand');
        commandSerivce.registerCommand(commandId + this.id, callback, true);
    }
    removeCommand(commandId: string, callback: ({errorNodeId}: HoverMenuCommandParam) => void) {
        const commandSerivce = this.parser.getService('hoverMenuCommand');
        commandSerivce.removeCommand(commandId, true);
    }
    sendErrorNodoInfoToWebwiew(params: MessageInfoSendParams) {
        // 这里执行，对key，以及lang等参数的筛选
        this.parser.webViewHooks.sendLangInfoHook.promise(params, this).then((data: MessageInfoSendParams) => {
            this.parser.webview.triggerWebviewListener('onErrorNode', data);
        });
    }
    formatErrorLog() {
    }
    _replace(start: number, end: number, text: string) {
        const fileContent = fs.readFileSync(this.filepath).toString();
        fs.writeFileSync(this.filepath, fileContent.substr(0, start) + text + fileContent.substr(end));
    }
    getCommandUrl(commandKey: any, params: any) {
        return `command:${commandKey}?${encodeURIComponent(JSON.stringify(params))}`
    }
    createHoverCommandMenu(menus: HoverCommandMenuItem[]) {
        const commands = menus.map((item: HoverCommandMenuItem) => {
            item.params.command = item.params.command + item.params.errorNodeId;
            return `- [${item.name}](${this.getCommandUrl(Commands.HoverMenu, item.params)})`;
        });
        const markdown = new vscode.MarkdownString(commands.join('\n'));
        markdown.isTrusted = true;
        return new vscode.Hover(markdown)
    }
    appendLog(log: string) {
        this.parser.utils.outputChannel.appendLine(log);
    }
    async replaceAndSave(errorInfo: MessageInfoResParams, text?: string) {
        var addParams: StorageAddParams[] = [];
        errorInfo.langs.forEach(item => {
            if (item.value) {
                addParams.push({
                    key: errorInfo.key,
                    text: item.value,
                    lang: item.langKey
                });
            }
        });
        await this.parser.intlStorage.storeKeyAndValues(addParams);
        this._replace(this.start, this.end, text ? text : `intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')`);
    }
    putColor() {
        const activeEditor = this.parser.utils.getActiveEditor();
        const {document} = activeEditor;
        if (document) {
            this.parser.addDecoration('red', {
                range: new vscode.Range(
                    document.positionAt(this.start),
                    document.positionAt(this.end),
                )
            });
        }
    }
    logError() {
        this.appendLog(this.getErrorLine());
    }
    getErrorLine() {
        return `${this.filepath}:${this.startRow}:${this.startCol}`;
    }
    showMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover> {
        return;
    }
}