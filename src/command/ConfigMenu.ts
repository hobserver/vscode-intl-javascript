import * as vscode from 'vscode';
import {Commands} from '../constants/command';
import { CommonCommandParam, HoverMenuCommandParam } from '../interface';
import ParserManager from '../model/ParserManager';
export default function(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.commands.registerCommand(Commands.ConfigMenu, (commandParams: any) => {
        // 获取当前的
        const {path} = commandParams;
        const parser = ParserManager.getSingleInstance().caches[path];
        const configMenuCommand = parser.getService('configMenuCommand');
        vscode.window.showQuickPick(configMenuCommand.menus).then((item) => {
            if (item) {
                configMenuCommand.triggerCommand(item.key, {});
            }
        });
    }));
}