import { HoverParams, ParseFileParam } from '../interface';
import Parser from './Parser';
import * as vscode from 'vscode';
declare class ParserManger {
    static instance: ParserManger;
    caches: {
        [filepath: string]: Parser;
    };
    static getSingleInstance(): ParserManger;
    parseCurrentFile(): void;
    parseDir(dirName: string): any;
    parseFile(filepath: string, { isPutColor, isShowLog }: ParseFileParam): unknown;
    showHoverMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover>;
}
export default ParserManger;
