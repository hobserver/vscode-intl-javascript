import { WebviewPanel } from "vscode";
import BaseErrorNode from "./BaseErrorNode";
import Parser from "./Parser";
declare class SidebarWebview {
    callbackCaches: {
        [callbackName: string]: (...args: any[]) => any;
    };
    webviewReady: boolean;
    panel?: WebviewPanel;
    parser?: Parser;
    setParser(parser: Parser): void;
    open(): Promise<undefined>;
    triggerWebviewListener(method: string, params: any, callback?: any): void;
    sendErrorNode(errorNode: BaseErrorNode): void;
    addWebviewListener(name: string, functionConstructorParams: string[]): void;
    addParentListener(name: string, func: (...args: any[]) => any): void;
    sendMessage(params: any): void;
    onMessage(data: any): void;
}
declare const _default: SidebarWebview;
export default _default;
