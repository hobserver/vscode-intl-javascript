import Parser from "../model/Parser";
import * as vscode from 'vscode';
import MenuCommand from "../plugins/menu-command/MenuCommand";
export declare type LangKey = 'zh_CN' | 'zh_TW';
export { Parser };
export interface ParserService {
    menuCommand: MenuCommand;
}
export declare type IntlStorageStoreHookCallback = (key: string, texts: {
    [langKey in LangKey]: string;
}) => void;
export interface StorageAddParams {
    key: string;
    text: string;
    lang: LangKey;
}
export interface WebviewListenerParams {
    name: string;
    functionConstructorParams: string[];
}
export interface MessageInfoSendParams {
    filePath: string;
    id: string;
    key: string;
    langs: {
        langKey: LangKey;
        value: string | null | undefined;
    }[];
}
export interface MessageInfoResParams extends MessageInfoSendParams {
}
export interface GlobalCommandParam {
    filePath: string;
    command: string;
    errorNodeId: any;
    [other: string]: any;
}
export interface GlobalCommandMenuItem {
    name: string;
    params: GlobalCommandParam;
}
export interface HoverParams {
    document: vscode.TextDocument;
    position: vscode.Position;
    offset: number;
}
export interface ErrorNodeParam {
    parser: Parser;
    filepath: string;
    start: number;
    end: number;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}
export interface ParseFileParam {
    isPutColor?: boolean;
    isShowLog: boolean;
}
export interface ErrorShowNode {
}
export interface SimplePositionParam {
    start: number;
    end: number;
}
export interface CheckResult {
    [key: string]: CheckResultItem;
}
export interface CheckResultItem {
    exist: boolean;
    ananimous: boolean;
}
export interface Lang {
    key: LangKey;
    name: string;
    color: string;
    check: boolean;
}
