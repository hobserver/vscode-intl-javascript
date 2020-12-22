import Parser from '../../model/Parser';
import * as vscode from 'vscode';
export default class WebViewPlugin {
    options: any;
    constructor(options?: any);
    initWebviewApi(parser: Parser): void;
    getStaticFileSrc(parser: Parser, filepath: string): vscode.Uri;
    apply(parser: Parser): Promise<void>;
}
