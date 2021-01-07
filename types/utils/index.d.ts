import * as vscode from 'vscode';
declare const _default: {
    readonly extensionId: string;
    readonly extension: vscode.Extension<any>;
    diagnostic: vscode.DiagnosticCollection;
    activeTextEditor: null;
    lastFilePath: string;
    setActiveTextEditor(activeTextEditor: any): void;
    setLastFilePath(filePath: any): void;
    getActiveTextEditor(): any;
    getCurrentFilePath(): string;
};
export default _default;
