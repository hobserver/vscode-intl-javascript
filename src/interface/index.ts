import Parser from "../model/Parser";
import * as vscode from 'vscode';
export type LangKey = 'zh_CN' | 'zh_TW';

export interface WebviewListenerParams {
    name: string,
    functionConstructorParams: string[]
}
export interface MessageInfoSendParams {
    filePath: string,
    id: string,
    key: string | undefined,
    langs: {
        langKey: LangKey,
        value: string | null | undefined | number
    }[]
}
export interface MessageInfoResParams extends MessageInfoSendParams {

}
export interface GlobalCommandParam {
    filePath: string
    type: string
    errorNodeId: any
}
export interface GlobalCommandMenuItem {
    name: string,
    params: GlobalCommandParam
}

export interface HoverParams {
    document: vscode.TextDocument,
    position: vscode.Position,
    offset: number
}

export interface ErrorNodeParam {
    parser: Parser
    filepath: string
    start: number
    end: number
    startRow: number
    startCol: number
    endRow: number
    endCol: number
}
export interface ParseFileParam {
    isPutColor?: boolean
    isShowLog: boolean
}
export interface ErrorShowNode {
}
export interface SimplePositionParam {
    start: number
    end: number
}
export type CheckResult = {
    [key in LangKey]: CheckResultItem
}
export interface CheckResultItem {
    exist: boolean,
    ananimous: boolean
}
export interface Lang {
    key: LangKey,
    name: string,
    color: string,
    check: boolean
}