import { WebviewPanel } from "vscode";
import BaseErrorNode from "./BaseErrorNode";
import Parser from "./Parser";
declare class SidebarWebview {
    static instance: SidebarWebview;
    static getSingleInstance(parser: Parser): SidebarWebview;
    callbackCaches: {
        [callbackName: string]: (...args: any[]) => any;
    };
    webviewReady: boolean;
    panel?: WebviewPanel;
    parser: Parser;
    constructor(parser: Parser);
    open(): Promise<undefined>;
    triggerWebviewListener(method: string, params: any, callback?: any): void;
    sendErrorNode(errorNode: BaseErrorNode): void;
    addWebviewListener(name: string, functionConstructorParams: string[]): void;
    addParentListener(name: string, func: (...args: any[]) => any): void;
    sendMessage(params: any): void;
    onMessage(data: any): void;
}
export default SidebarWebview;
