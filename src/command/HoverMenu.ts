import * as vscode from 'vscode';
import {Commands} from '../constants/command';
import { HoverMenuCommandParam } from '../interface';
import ParserManager from '../model/ParserManager';
const setHoverMenuCommand = (ctx: vscode.ExtensionContext) => {
    ctx.subscriptions.push(vscode.commands.registerCommand(Commands.HoverMenu, (commandParams: HoverMenuCommandParam) => {
        const {filePath, command} = commandParams;
        const parser = ParserManager.getSingleInstance().caches[filePath];
        if (parser) {
            const listeners = parser.getService('hoverMenuCommand').listeners[command];
            listeners.forEach(listener => {
                listener(commandParams);
            });
        }
    }));
}
export default setHoverMenuCommand;