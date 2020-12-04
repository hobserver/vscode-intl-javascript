import { ErrorNodeParam, MessageInfoSendParams, GlobalCommandMenuItem, HoverParams, MessageInfoResParams, GlobalCommandParam } from '../interface';
import * as vscode from 'vscode';
import Parser from './Parser';
export default class {
    id: string;
    parser: Parser;
    filepath: string;
    start: number;
    end: number;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    constructor({ parser, filepath, start, end, startRow, startCol, endRow, endCol }: ErrorNodeParam);
    registerCommand(commandId: string, callback: ({ errorNodeId }: GlobalCommandParam) => void): void;
    removeCommand(commandId: string, callback: ({ errorNodeId }: GlobalCommandParam) => void): void;
    sendErrorNodoInfoToWebwiew(params: MessageInfoSendParams): void;
    formatErrorLog(): void;
    _replace(start: number, end: number, text: string): void;
    getCommandUrl(commandKey: any, params: any): string;
    createHoverCommandMenu(menus: GlobalCommandMenuItem[]): vscode.Hover;
    appendLog(log: string): void;
    replaceAndSave(errorInfo: MessageInfoResParams, text?: string): void;
    putColor(): void;
    logError(): void;
    getErrorLine(): string;
    showMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover>;
}
