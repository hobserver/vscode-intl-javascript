import { WebviewPanel } from "vscode";
import Parser from "./Parser";
declare class SingleWebview {
    static instance: SingleWebview;
    callbackCaches: {
        [callbackName: string]: (...args: any[]) => any;
    };
    webviewReady: boolean;
    panel?: WebviewPanel;
    parser: Parser;
    static getSingleInstance(): SingleWebview;
    openWebview(parser: Parser): Promise<undefined>;
    sendMessage(params: any): void;
    onMessage(data: any): void;
}
export default SingleWebview;
