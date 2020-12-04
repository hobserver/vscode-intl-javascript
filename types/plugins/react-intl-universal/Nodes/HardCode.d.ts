import BaseNode from '../../../model/BaseErrorNode';
import { ErrorNodeParam, HoverParams, MessageInfoResParams } from '../../../interface';
import * as vscode from 'vscode';
export default class NoKeyErrorNode extends BaseNode {
    type: string;
    extraParams: {
        text: string;
        params?: {
            [key: string]: any;
        } | undefined;
        getMethod: string;
    };
    constructor(params: ErrorNodeParam, extraParams: {
        text: string;
        params?: {
            [key: string]: any;
        };
        getMethod: string;
    });
    replaceAndSave(errorInfo: MessageInfoResParams, text?: string): void;
    replaceAndSaveWithBrackets(errorInfo: MessageInfoResParams): void;
    showMenu({ position, document, offset }: HoverParams): vscode.ProviderResult<vscode.Hover>;
    logError(): void;
}
