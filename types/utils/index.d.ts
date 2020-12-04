import * as vscode from 'vscode';
declare const _default: {
    readonly extensionId: string;
    readonly extension: vscode.Extension<any>;
    activeTextEditor: typeof vscode.TextEdit;
    outputChannel: vscode.OutputChannel;
    setActiveTextEditor(activeTextEditor: any): void;
    getActiveEditor(): any;
    getCurrentFilePath(): any;
};
export default _default;
