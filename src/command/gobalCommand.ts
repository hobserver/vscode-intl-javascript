import * as vscode from 'vscode';
import {Commands} from '../constants/command';
import { GlobalCommandParam } from '../interface';
import ParserManager from '../model/ParserManager';
export default function(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.commands.registerCommand(Commands.GlobalCallback, (commandParams: GlobalCommandParam) => {
        const {filePath, command, errorNodeId} = commandParams;
        const parser = ParserManager.getSingleInstance().caches[filePath];
        if (parser) {
            const listeners = parser.getService('menuCommand').listeners[command];
            listeners.forEach(listener => {
                listener(commandParams);
            });
        }
    }));
}