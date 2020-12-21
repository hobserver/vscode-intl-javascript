import * as vscode from 'vscode';
declare const _default: {
    readonly extensionId: string;
    readonly extension: vscode.Extension<any>;
    diagnostic: vscode.DiagnosticCollection;
    activeTextEditor: typeof vscode.TextEdit;
    setActiveTextEditor(activeTextEditor: any): void;
    getActiveEditor(): any;
    getCurrentFilePath(): any;
};
export default _default;
