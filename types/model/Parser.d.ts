import * as vscode from 'vscode';
import BaseErrorNode from './BaseErrorNode';
import Config from "./Config";
import IntlStorage from "./IntlStorage";
import Service from './Service';
import { MessageInfoSendParams, WebviewListenerParams } from '../interface';
import SidebarWebview from './WebView';
import ParserManager from './ParserManager';
import { SyncWaterfallHook, HookMap, AsyncParallelHook, AsyncSeriesWaterfallHook } from 'tapable';
export default class Parser extends Service {
    errorCount: number;
    parserManager: ParserManager;
    private _prevDecorations;
    utils: {
        readonly extensionId: string;
        readonly extension: vscode.Extension<any>;
        diagnostic: vscode.DiagnosticCollection;
        activeTextEditor: typeof vscode.TextEdit;
        setActiveTextEditor(activeTextEditor: any): void;
        getActiveEditor(): any;
        getCurrentFilePath(): any;
    };
    plugins: any;
    webview: SidebarWebview;
    decorations: {
        [color: string]: (vscode.Range | vscode.DecorationOptions)[];
    };
    diagnostics: vscode.Diagnostic[];
    errorsMap: {
        [key: string]: BaseErrorNode;
    };
    errors: BaseErrorNode[];
    config: Config;
    babelHooks: {
        babelPresetHook: SyncWaterfallHook<[string[]]>;
        babelPluginHook: SyncWaterfallHook<[string[]]>;
    };
    updateHook: AsyncSeriesWaterfallHook<[(() => void)[]]>;
    processListenerHook: HookMap<AsyncParallelHook<[any]>>;
    webViewHooks: {
        htmlHook: AsyncSeriesWaterfallHook<[string]>;
        titleHook: AsyncSeriesWaterfallHook<[string]>;
        headHook: AsyncSeriesWaterfallHook<[string[]]>;
        jsHook: AsyncSeriesWaterfallHook<[string[]]>;
        metaHook: AsyncSeriesWaterfallHook<[string[]]>;
        cssHook: AsyncSeriesWaterfallHook<[string[]]>;
        bodyHtmlHook: AsyncSeriesWaterfallHook<[string[]]>;
        btnHook: AsyncSeriesWaterfallHook<[string[]]>;
        bodyFooterJsHook: AsyncSeriesWaterfallHook<[string[]]>;
        bodyHeaderJsHook: AsyncSeriesWaterfallHook<[string[]]>;
        listenerHook: AsyncSeriesWaterfallHook<[WebviewListenerParams[]]>;
        sendLangInfoHook: AsyncSeriesWaterfallHook<[MessageInfoSendParams, BaseErrorNode, Parser?]>;
        vueHooks: {
            createdHook: AsyncSeriesWaterfallHook<[string[][]]>;
            methodsHook: AsyncSeriesWaterfallHook<[WebviewListenerParams[]]>;
        };
    };
    intlStorage: IntlStorage;
    filepath: string;
    private isComplete;
    parserCatch: (err: any) => void;
    constructor(filepath: string);
    handlePlugins(): Promise<void>;
    initHooks(): void;
    addDiagnostic(message: string, range: {
        startCol: number;
        startRow: number;
        endCol: number;
        endRow: number;
    }): void;
    addDecoration(color: string, range: vscode.Range | vscode.DecorationOptions): void;
    pushError(errorNode: BaseErrorNode): void;
    parse(): Promise<this>;
    private resetDataForConfig;
    logErrors(isClear?: boolean): Promise<void>;
    putColors(): Promise<void>;
    private babelParser;
}
