import * as vscode from 'vscode';
import {Commands} from '../constants/command';
import { GlobalCommandParam } from '../interface';
import parserManager from '../model/ParserManager';
export default (ctx: vscode.ExtensionContext) => {
    ctx.subscriptions.push(vscode.commands.registerCommand(Commands.GlobalCallback, (commandParams: GlobalCommandParam) => {
        const {filePath, command, errorNodeId} = commandParams;
        const parser = parserManager.caches[filePath];
        if (parser) {
            const hook = parser.commandHooks.get(command);
            if (hook) {
                hook.call(errorNodeId);
                // callbacks.forEach((callback: any) => {
                //     callback(params);
                // });
            }
        }
    }));
}