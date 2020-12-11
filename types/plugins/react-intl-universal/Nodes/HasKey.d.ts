import BaseNode from '../../../model/BaseErrorNode';
import { ErrorNodeParam, CheckResult, Lang, HoverParams, MessageInfoResParams } from '../../../interface';
import * as vscode from 'vscode';
export default class HasKeyErrorNode extends BaseNode {
    extraParams: {
        key: string;
        text: string;
        keyStart: number;
        keyEnd: number;
        textStart: number;
        textEnd: number;
        params?: any;
    };
    checkResult: CheckResult;
    firstErrorLang?: Lang;
    logs: string[];
    isCheck: boolean;
    constructor(position: ErrorNodeParam, extraParams: {
        key: string;
        text: string;
        keyStart: number;
        keyEnd: number;
        textStart: number;
        textEnd: number;
        params?: any;
    });
    getLog(): void;
    replaceAndSave(errorInfo: MessageInfoResParams, text?: string): Promise<void>;
    replaceAndSaveWithBrackets(errorInfo: MessageInfoResParams): void;
    check(): void;
    logError(): void;
    showMenu({ position, document, offset }: HoverParams): vscode.ProviderResult<vscode.Hover>;
    putColor(): void;
}
