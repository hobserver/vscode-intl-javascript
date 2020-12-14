import * as vscode from 'vscode';
import {extensions} from 'vscode';
const path = require('path');
import config from '../config/index';
export default {
    get extensionId(): string {
        return `${config.publisher}.${config.name}`;
    },
    get extension(): vscode.Extension<any> {
        // @ts-ignore
        return extensions.getExtension(this.extensionId);
    },
    activeTextEditor: vscode.TextEdit,
    outputChannel: vscode.window.createOutputChannel('this.config.name'),
    setActiveTextEditor(activeTextEditor: any) {
        if (activeTextEditor?.document?.fileName) {
            this.activeTextEditor = activeTextEditor;
        }
    },
    getActiveEditor(): any {
        if (this.activeTextEditor) {
            return this.activeTextEditor;
        } else {
            vscode.window.showInformationMessage('请选择一个文件');
            throw new Error('请选择一个文件');
        }
    },
    getCurrentFilePath() {
        const activeTextEditor = this.getActiveEditor();
        return activeTextEditor.document.fileName;
    }
}