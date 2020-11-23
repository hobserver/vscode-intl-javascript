import {ErrorNodeParam, MessageInfoSendParams, GlobalCommandMenuItem, HoverParams, LangKey} from '../interface';
import * as vscode from 'vscode';
import Parser from './Parser';
var uuid = require('node-uuid');
import * as fs from 'fs';
import { Commands } from '../constants/command';
export default class {
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
        this.id = uuid();
        this.parser = parser;
        this.filepath = filepath;
        this.start = start;
        this.end = end;
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
    }
    sendErrorNodoInfoToWebwiew(params: MessageInfoSendParams) {
        this.parser.webview.triggerWebviewListener('onErrorNode', params);
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
    createHoverCommandMenu(menus: GlobalCommandMenuItem[]) {
        const commands = menus.map((item: GlobalCommandMenuItem) => {
            return `- [${item.name}](${this.getCommandUrl(Commands.GlobalCallback, item.params)})`;
        });
        const markdown = new vscode.MarkdownString(commands.join('\n'));
        markdown.isTrusted = true;
        return new vscode.Hover(markdown)
    }
    appendLog(log: string) {
        this.parser.utils.outputChannel.appendLine(log);
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
    isShowHover(params: HoverParams): boolean {
        return false;
    }
    showMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover> {
        return;
    }
}