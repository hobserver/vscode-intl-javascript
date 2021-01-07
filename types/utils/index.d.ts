import * as vscode from 'vscode';
declare const _default: {
    readonly extensionId: string;
    readonly extension: vscode.Extension<any>;
    diagnostic: vscode.DiagnosticCollection;
    activeTextEditor: null;
    lastFilePath: null;
    setActiveTextEditor(activeTextEditor: any): void;
    getFirstActiveEditor(): vscode.TextEditor;
    isAbsoluteActiveEditor(activeEditor: vscode.TextEditor): boolean;
    getActiveTextEditor(): any;
    getLastFilePath(): null;
    getCurrentFilePath(): string;
};
export default _default;
