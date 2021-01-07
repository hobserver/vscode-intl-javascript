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
    lastFilePath: '',
    setActiveTextEditor(activeTextEditor: any) {
        this.activeTextEditor = activeTextEditor;
        this.setLastFilePath(activeTextEditor.document.fileName);
    },
    setLastFilePath(filePath: any) {
        this.lastFilePath = filePath;
    },
    getActiveTextEditor(): any {
        return this.activeTextEditor;
    },
    getCurrentFilePath(): string {
        return this.lastFilePath;
    }
}