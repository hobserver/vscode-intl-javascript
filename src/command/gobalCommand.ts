import * as vscode from 'vscode';
import {Commands} from '../constants/command';
import { GlobalCommandParam } from '../interface';
import parserManager from '../model/ParserManager';
export default (ctx: vscode.ExtensionContext) => {
    ctx.subscriptions.push(vscode.commands.registerCommand(Commands.GlobalCallback, (commandParams: GlobalCommandParam) => {
        const {filePath, command, errorNodeId} = commandParams;
        const parser = parserManager.caches[filePath];
        if (parser) {
            const listeners = parser.getService('menuCommand').listeners[command];
            listeners.forEach(listener => {
                listener(commandParams);
            });
        }
    }));
}