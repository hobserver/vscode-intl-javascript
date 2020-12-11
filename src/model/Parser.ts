const babelCore = require('@babel/core');
import * as vscode from 'vscode';
import * as path from 'path';
import BaseErrorNode from './BaseErrorNode';
import Config from "./Config";
import IntlStorage from "./IntlStorage";
import utils from '../utils/index';
import Service from './Service';
import { MessageInfoSendParams, ParseFileParam, WebviewListenerParams } from '../interface';
import WebViewPlugin from '../plugins/webview/index';
import HoverCommandPlugin from '../plugins/hover-menu-command/index';
import ConfigCommandPlugin from '../plugins/config-menu-command/index';
import SidebarWebview from './WebView';
import ParserManager from './ParserManager';
import noCacheRequire from '../utils/no-cache-require';
import {
    SyncWaterfallHook,
    SyncHook,
    HookMap,
    AsyncParallelHook,
    AsyncSeriesWaterfallHook
} from 'tapable';
export default class Parser extends Service {
    public parserManager: ParserManager;
    private _prevDecorations: vscode.TextEditorDecorationType[]  = [];
    public utils = utils;
    public plugins: any = [] // 可以传入对象，也可以传入数组
    public webview: SidebarWebview;
    public decorations: {
        [color: string]: (vscode.Range | vscode.DecorationOptions)[]
    } = {};
    public errorsMap: {
        [key: string]: BaseErrorNode
    } = {};
    public errors: BaseErrorNode[] = [];
    public config: Config
    // @ts-ignore
    public babelHooks: {
        babelPresetHook: SyncWaterfallHook<[string[]]>,
        babelPluginHook: SyncWaterfallHook<[string[]]>
    }
     // @ts-ignore
    public processListenerHook: HookMap<AsyncParallelHook<[any]>>
     // @ts-ignore
    public webViewHooks: {
        htmlHook: AsyncSeriesWaterfallHook<[string]>,
        titleHook: AsyncSeriesWaterfallHook<[string]>,
        headHook: AsyncSeriesWaterfallHook<[string[]]>,
        jsHook: AsyncSeriesWaterfallHook<[string[]]>,
        metaHook: AsyncSeriesWaterfallHook<[string[]]>,
        cssHook: AsyncSeriesWaterfallHook<[string[]]>,
        bodyHtmlHook: AsyncSeriesWaterfallHook<[string[]]>,
        btnHook: AsyncSeriesWaterfallHook<[string[]]>,
        bodyFooterJsHook: AsyncSeriesWaterfallHook<[string[]]>,
        bodyHeaderJsHook: AsyncSeriesWaterfallHook<[string[]]>,
        listenerHook: AsyncSeriesWaterfallHook<[WebviewListenerParams[]]>,
        sendLangInfoHook: AsyncSeriesWaterfallHook<[MessageInfoSendParams, BaseErrorNode, Parser?]>,
        vueHooks: {
            createdHook: AsyncSeriesWaterfallHook<[string[][]]>,
            methodsHook: AsyncSeriesWaterfallHook<[WebviewListenerParams[]]>,
        }
    }
    public intlStorage: IntlStorage
    public filepath: string
    private isComplete: boolean = true;
    parserCatch = (err: any) => {
        vscode.window.showWarningMessage(err.toString());
        this.isComplete = true;
    }
    constructor (filepath: string) {
        super();
        this.parserManager = ParserManager.getSingleInstance();
        this.webview = SidebarWebview.getSingleInstance();
        this.filepath = filepath;
        this.config = new Config(this, filepath);
        this.intlStorage = new IntlStorage(this.config);
    }
    async handlePlugins() {
        for (var i = 0; i < this.plugins.length; i++) {
            const plugin = this.plugins[i];
             // @ts-ignore todo
            if (!plugin.length) {
                await (plugin as any).apply(this);
            } else {
                const [PluginClassPath, option] = plugin;
                if (!path.isAbsolute(PluginClassPath)) {
                    throw(new Error('请提供插件的绝对路径'));
                } else {
                    const PluginClass = noCacheRequire(PluginClassPath).default;
                    const pluginInstance = new PluginClass(option);
                    await pluginInstance.apply(this);
                }
            } 
        }
   }
    initHooks() {
        this.babelHooks = {
            babelPresetHook: new SyncWaterfallHook(['presets']),
            babelPluginHook: new SyncWaterfallHook(['plugins']),
        };
        this.webViewHooks = {
            htmlHook: new AsyncSeriesWaterfallHook(['html']),
            titleHook: new AsyncSeriesWaterfallHook(['title']),
            headHook: new AsyncSeriesWaterfallHook(['headers']),
            metaHook: new AsyncSeriesWaterfallHook(['metas']),
            jsHook: new AsyncSeriesWaterfallHook(['jss']),
            btnHook: new AsyncSeriesWaterfallHook(['btns']),
            cssHook: new AsyncSeriesWaterfallHook(['csss']),
            bodyHtmlHook: new AsyncSeriesWaterfallHook(['body']),
            bodyFooterJsHook: new AsyncSeriesWaterfallHook(['footerJss']),
            bodyHeaderJsHook: new AsyncSeriesWaterfallHook(['headerJss']),
            listenerHook: new AsyncSeriesWaterfallHook(['listeners']),
            sendLangInfoHook: new AsyncSeriesWaterfallHook(['params', 'nodeInfo', 'parser']),
            vueHooks: {
                createdHook: new AsyncSeriesWaterfallHook(['createdInits']),
                methodsHook: new AsyncSeriesWaterfallHook(['methods']),
            }
        };
        this.processListenerHook = new HookMap((type: string) => new AsyncParallelHook(["params"]));
    }
    public addDecoration(color: string, range: vscode.Range | vscode.DecorationOptions) {
        if (!this.decorations[color]) {
            this.decorations[color] = [];
        }
        this.decorations[color].push(range);
    }
    public pushError(errorNode: BaseErrorNode) {
         // 重复的ErrorNode 不添加
        if(this.errors.find((item) => {
            return item.id === errorNode.id
        })) {
            return;
        }
        const key = `${errorNode.start}-${errorNode.end}`;
        if (!this.errorsMap[key]) {
            this.errorsMap[key] = errorNode;
            this.errors.push(errorNode);
        }
    }
    
    public async parse({
        isPutColor = false,
        isShowLog = true
    }: ParseFileParam) {
        if (!this.isComplete) return Promise.reject();
        if (!isShowLog && !isPutColor) return Promise.reject();
        this.isComplete = false;
        try {
            this.resetDataForConfig(); // 重置缓存对象
            await this.config.init();
            await this.intlStorage.initLang();
            await this.handlePlugins();
            this.webview.setParser(this);
            await this.babelParser();
            if (isShowLog) {
                await this.logErrors(isPutColor ? true : false);
            }
            if (isPutColor) {
                await this.putColors();
            }
            this.isComplete = true;
        } catch (err) {
            this.isComplete = true;
            vscode.window.showWarningMessage(`解析失败 - ${this.filepath}` + err.toString());
            return Promise.reject();
        }
    }
    private resetDataForConfig() {
        this.errors = [];
        this.plugins = [
            new ConfigCommandPlugin(),
            new HoverCommandPlugin(),
            new WebViewPlugin(),
        ];
        this.decorations = {};
        this._prevDecorations.forEach(decoration => {
            utils.getActiveEditor()?.setDecorations(decoration, [])
        });
        this._prevDecorations = [];
        this.errorsMap = {};
        this.initHooks();
    }
    public async logErrors(isClear: boolean) {
        if (isClear) {
            utils.outputChannel.clear();
        }
        this.errors?.forEach((error) => {
            error.logError();
        });
        await utils.outputChannel.show();
    }
    public async putColors() {
        this.errors?.forEach((error) => {
            error.putColor();
        });
        Object.keys(this.decorations).forEach((decorationType: string) => {
            const decoration = vscode.window.createTextEditorDecorationType(
                {
                    color: decorationType
                }
            );
            this._prevDecorations.push(decoration);
            utils.getActiveEditor()?.setDecorations(decoration, this.decorations[decorationType])
        });
    }
    private babelParser() {
        return new Promise((resolve, rejects) => {
            babelCore.transformFile(this.filepath, {
                presets: this.babelHooks.babelPresetHook.call([]),
                plugins: this.babelHooks.babelPluginHook.call([])
            }, (err: any) => {
                if (err) {
                    this.isComplete = true;
                    vscode.window.showWarningMessage(`${this.filepath} - Babel解析失败` + err.stack);
                    rejects();
                } else {
                    resolve(err);
                }
            });
        })
    }
}