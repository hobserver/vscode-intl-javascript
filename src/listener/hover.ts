import { ExtensionContext, commands, window, HoverProvider, ViewColumn } from "vscode";
import * as vscode from 'vscode';
import ParserManager from '../model/ParserManager';
import utils from "../utils";

class CodeHover implements HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const offset = document.offsetAt(position);
        return ParserManager.getSingleInstance().showHoverMenu({offset, position, document});
    }
}
export default function createCodeHover(ctx: ExtensionContext) {
    ctx.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { pattern: '**/*.{ts,js,tsx,jsx}' },
            new CodeHover()
        )
    );
}