import * as vscode from 'vscode';
import {extensions} from 'vscode';
const path = require('path');
import config from '../config/index';
const id = `${config.publisher}.${config.name}`;
export default {
    get extensionId(): string {
        return `${config.publisher}.${config.name}`;
    },
    get extension(): vscode.Extension<any> {
        // @ts-ignore
        return extensions.getExtension(this.extensionId);
    },
    diagnostic: vscode.languages.createDiagnosticCollection(id),
    activeTextEditor: null,
    lastFilePath: null,
    setActiveTextEditor(activeTextEditor: any) {
        if (activeTextEditor && activeTextEditor.document && activeTextEditor.document.fileName && activeTextEditor.document.fileName != '') {
            this.lastFilePath = activeTextEditor.document.fileName;
        }
    },
    getFirstActiveEditor() {
        const activeEditor = vscode.window.visibleTextEditors.find(item => {
            if (item.document.fileName) {
                return true;
            }
        });
        if (activeEditor && path.isAbsolute(activeEditor.document.fileName)) {
            return activeEditor;
        } else {
            vscode.window.showInformationMessage('请选择一个文件');
            throw new Error('请选择一个文件');
        }
    },
    isAbsoluteActiveEditor(activeEditor: vscode.TextEditor) {
        if (activeEditor.document.fileName && path.isAbsolute(activeEditor.document.fileName)) {
            return true;
        } else {
            return false;
        }
    },
    getActiveTextEditor(): any {
        if (!vscode.window.activeTextEditor) {
            return this.getFirstActiveEditor();
        } else {
            if (this.isAbsoluteActiveEditor(vscode.window.activeTextEditor)) {
                return vscode.window.activeTextEditor;
            } else {
                return this.getFirstActiveEditor();
            }
        }
    },
    getLastFilePath() {
        return this.lastFilePath;
    },
    getCurrentFilePath(): string {
        return this.getActiveTextEditor().document.fileName;
    }
}