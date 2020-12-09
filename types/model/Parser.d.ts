import * as vscode from 'vscode';
import BaseErrorNode from './BaseErrorNode';
import Config from "./Config";
import IntlStorage from "./IntlStorage";
import Service from './Service';
import { MessageInfoSendParams, ParseFileParam, WebviewListenerParams } from '../interface';
import SidebarWebview from './WebView';
import ParserManager from './ParserManager';
import { SyncWaterfallHook, HookMap, AsyncParallelHook, AsyncSeriesWaterfallHook } from 'tapable';
export default class Parser extends Service {
    parserManager: ParserManager;
    private _prevDecorations;
    utils: {
        readonly extensionId: string;
        readonly extension: vscode.Extension<any>;
        activeTextEditor: typeof vscode.TextEdit;
        outputChannel: vscode.OutputChannel;
        setActiveTextEditor(activeTextEditor: any): void;
        getActiveEditor(): any;
        getCurrentFilePath(): any;
    };
    plugins: any;
    webview: SidebarWebview;
    decorations: {
        [color: string]: (vscode.Range | vscode.DecorationOptions)[];
    };
    errorsMap: {
        [key: string]: BaseErrorNode;
    };
    errors: BaseErrorNode[];
    config: Config;
    babelHooks: {
        babelPresetHook: SyncWaterfallHook<[string[]]>;
        babelPluginHook: SyncWaterfallHook<[string[]]>;
    };
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
    handlePlugins(): any;
    initHooks(): void;
    addDecoration(color: string, range: vscode.Range | vscode.DecorationOptions): void;
    pushError(errorNode: BaseErrorNode): void;
    parse({ isPutColor, isShowLog }: ParseFileParam): unknown;
    private resetDataForConfig;
    logErrors(isClear: boolean): any;
    putColors(): any;
    private babelParser;
}
