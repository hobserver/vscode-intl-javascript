import { HoverParams, ParseFileParam } from '../interface';
import Parser from '../model/Parser';
import * as vscode from 'vscode';
declare class ParserManger {
    caches: {
        [filepath: string]: Parser;
    };
    parseCurrentFile(): void;
    parseDir(dirName: string): any;
    parseFile(filepath: string, { isPutColor, isShowLog }: ParseFileParam): Promise<undefined>;
    showHoverMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover>;
}
declare const parserManager: ParserManger;
export default parserManager;
