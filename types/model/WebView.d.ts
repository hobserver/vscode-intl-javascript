import BaseErrorNode from "./BaseErrorNode";
import Parser from "./Parser";
import SingleWebview from './SingleWebview';
declare class SidebarWebview {
    parser: Parser;
    singleWebview: SingleWebview;
    constructor(parser: Parser);
    open(): Promise<undefined>;
    triggerWebviewListener(method: string, params: any, callback?: any): void;
    sendErrorNode(errorNode: BaseErrorNode): void;
    addWebviewListener(name: string, functionConstructorParams: string[]): void;
    addParentListener(name: string, func: (...args: any[]) => any): void;
    sendMessage(params: any): void;
}
export default SidebarWebview;
