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
import utils from '../utils';
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
        // 如果当前文件，是当前窗口，那么就用另一种api
        const currentDocumentFilepath = vscode.window.activeTextEditor?.document.fileName;
        if (currentDocumentFilepath === this.filepath) {
            const activeTextEditor = utils.getActiveEditor()
            activeTextEditor.edit((editBuilder: any) => {
                editBuilder.replace(new vscode.Range(
                    this.startRow - 1,
                    this.startCol,
                    this.endRow - 1,
                    this.endCol,
                ), text);
            })
        } else {
            fs.writeFileSync(this.filepath, fileContent.substr(0, start) + text + fileContent.substr(end));
        }
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
    logError(text?: string) {
        this.parser.addDiagnostic(text || '出现错误', {
            startCol: this.startCol,
            startRow: this.startRow,
            endCol: this.endCol,
            endRow: this.endRow
        });
    }
    showMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover> {
        return;
    }
}