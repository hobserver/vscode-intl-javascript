import { ErrorNodeParam, MessageInfoSendParams, HoverCommandMenuItem, HoverParams, MessageInfoResParams, HoverMenuCommandParam } from '../interface';
import * as vscode from 'vscode';
import Parser from './Parser';
export default class {
    isRight: boolean;
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
    registerCommand(commandId: string, callback: ({ errorNodeId }: HoverMenuCommandParam) => void): void;
    removeCommand(commandId: string, callback: ({ errorNodeId }: HoverMenuCommandParam) => void): void;
    sendErrorNodoInfoToWebwiew(params: MessageInfoSendParams): void;
    formatErrorLog(): void;
    _replace(start: number, end: number, text: string): void;
    getCommandUrl(commandKey: any, params: any): string;
    createHoverCommandMenu(menus: HoverCommandMenuItem[]): vscode.Hover;
    replaceAndSave(errorInfo: MessageInfoResParams, text?: string): Promise<void>;
    putColor(): void;
    logError(text?: string): void;
    showMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover>;
}
