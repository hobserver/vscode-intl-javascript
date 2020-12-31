import Parser from "../model/Parser";
import * as vscode from 'vscode';
import CommonCommand from "../model/CommonCommand";
import ConfigCommonCommand from "../plugins/config-menu-command/ConfigMenuCommand";
export declare type LangKey = 'zh_CN' | 'en_US' | 'zh_TW';
export { Parser };
export interface GrammarCheckParam {
    pluginName: string;
    type: string;
    nodePath: any;
}
export interface ParserService {
    configMenuCommand: ConfigCommonCommand;
    hoverMenuCommand: CommonCommand<HoverMenuCommandParam>;
}
export declare type IntlStorageStoreHookCallback = (key: string, texts: {
    [langKey in LangKey]: string;
}) => void;
export interface StorageAddParams {
    key: string;
    text: string;
    lang: LangKey;
}
export interface WebviewBtn {
    key: string;
    text: string;
    functionConstructorParams: string[];
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
export interface UpdateQueueParam {
}
export interface CommonCommandParam {
    filePath: string;
    command: string;
    [other: string]: any;
}
export interface HoverMenuCommandParam extends CommonCommandParam {
    errorNodeId: any;
}
export interface HoverCommandMenuItem {
    name: string;
    params: HoverMenuCommandParam;
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
