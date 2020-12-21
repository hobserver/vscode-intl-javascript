import * as vscode from 'vscode';
import {Commands} from '../constants/command';
import ParserManager from '../model/ParserManager';
import utils from '../utils/index';
import * as fs from 'fs';
const setCheckAllFilesCommand = (ctx: vscode.ExtensionContext) => {
    ctx.subscriptions.push(vscode.commands.registerCommand(Commands.CheckAllFiles, (commandParams: any) => {
        // 获取当前的
        const parserManager = ParserManager.getSingleInstance();
        const currentDir = utils.getCurrentFilePath();
        vscode.window.showInputBox({
            prompt: '请输入要check的文件夹路径',
            value: currentDir,
            valueSelection: [currentDir.lastIndexOf('/'), currentDir.length]
        }).then((dir: any) => {
            if (fs.statSync(dir).isDirectory()) {
                parserManager.parseDir(dir);
            } else {
                parserManager.parseFile(dir).then((parser) => {
                    parser.logErrors();
                });
            }
        });
    }));
}
export default setCheckAllFilesCommand;