import { HoverParams } from '../interface';
import Parser from './Parser';
import * as vscode from 'vscode';
declare class ParserManger {
    static instance: ParserManger;
    caches: {
        [filepath: string]: Parser;
    };
    lastUpdateTime: number;
    static getSingleInstance(): ParserManger;
    handleTimerQueue(): Promise<void>;
    parseCurrentFile(): Promise<Parser>;
    parseDir(dirName: string): Promise<any>;
    parseFile(filepath: string): Promise<Parser>;
    showHoverMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover>;
}
export default ParserManger;
