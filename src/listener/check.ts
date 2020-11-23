import { ExtensionContext, window } from "vscode";
import * as vscode from "vscode";
import * as path from 'path';
import parserManager from '../model/ParserManager';
import utils from "../utils";
function update() {
    parserManager.parseCurrentFile();
}
export default function init(context: ExtensionContext) {
    context.subscriptions.push(window.onDidChangeActiveTextEditor(() => {
        const filepath = vscode.window.activeTextEditor?.document.fileName;
        if (filepath) {
            if (path.isAbsolute(filepath)) {
                utils.setActiveTextEditor(vscode.window.activeTextEditor);
            }
            update();
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
        const filepath = vscode.window.activeTextEditor?.document.fileName;
        if (filepath) {
            if (path.isAbsolute(filepath)) {
                utils.setActiveTextEditor(vscode.window.activeTextEditor);
            }
            update();
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-intl-javascript.CHECK_DIR_LOCALE', () => {
        // 获取当前文件路径, 然后根据路径获取配置文件
        const filepath = utils.getCurrentFilePath();
        const currentDir = path.dirname(filepath);
        window.showInputBox({
            prompt: '请输入要check的文件夹路径',
            value: currentDir,
            valueSelection: [currentDir.lastIndexOf('/'), currentDir.length]
        }).then((dir: any) => {
            parserManager.parseDir(currentDir); 
        });
    }));
}