import BaseNode from '../../../model/BaseErrorNode';
import { ErrorNodeParam, HoverParams, MessageInfoResParams } from '../../../interface';
import * as vscode from 'vscode';
export default class NoKeyErrorNode extends BaseNode {
    type: string;
    extraParams: {
        text: string;
        params?: string | null | undefined;
        getMethod: string;
    };
    constructor(params: ErrorNodeParam, extraParams: {
        text: string;
        params?: string | null;
        getMethod: string;
    });
    getReplaceString(key: string, value: string): string;
    replaceAndSave(errorInfo: MessageInfoResParams, text?: string): Promise<void>;
    replaceAndSaveWithBrackets(errorInfo: MessageInfoResParams): Promise<void>;
    showMenu({ position, document, offset }: HoverParams): vscode.ProviderResult<vscode.Hover>;
    logError(): void;
}
