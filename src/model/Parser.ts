const babelCore = require('@babel/core');
import * as vscode from 'vscode';
import BaseErrorNode from './BaseErrorNode';
import Config from "./Config";
import IntlStorage from "./IntlStorage";
import utils from '../utils/index';
import { ParseFileParam } from '../interface';
import WebViewPlugin from '../plugins/webview/index';
import webview from './WebView';
import parserManager from './ParserManager';
import noCacheRequire from '../utils/no-cache-require';
const {
    SyncWaterfallHook,
    SyncHook,
    HookMap,
    AsyncParallelHook,
    AsyncSeriesWaterfallHook
 } = require("tapable");
export default class {
    public parserManager = parserManager;
    private _prevDecorations: vscode.TextEditorDecorationType[]  = [];
    public utils = utils;
    public plugins: any = [ // 可以传入对象，也可以传入数组
        new WebViewPlugin()
    ]
    public webview = webview;
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
        babelPresetHook: typeof SyncWaterfallHook
        babelPluginHook: typeof SyncWaterfallHook
    }
     // @ts-ignore
    public commandHooks: typeof HookMap
    public webviewListenerHook: typeof SyncWaterfallHook
    public webviewParentListenerHook: typeof HookMap
     // @ts-ignore
    public webViewHooks: {
        htmlHook: typeof AsyncSeriesWaterfallHook,
        titleHook: typeof AsyncSeriesWaterfallHook,
        headHook: typeof AsyncSeriesWaterfallHook,
        jsHook: typeof AsyncSeriesWaterfallHook,
        metaHook: typeof AsyncSeriesWaterfallHook,
        cssHook: typeof AsyncSeriesWaterfallHook,
        bodyHtmlHook: typeof AsyncSeriesWaterfallHook,
        btnHook: typeof AsyncSeriesWaterfallHook,
        bodyFooterJsHook: typeof AsyncSeriesWaterfallHook,
        bodyHeaderJsHook: typeof AsyncSeriesWaterfallHook,
        vueHooks: {
            createdHook: typeof AsyncSeriesWaterfallHook,
            methodsHook: typeof AsyncSeriesWaterfallHook,
        }
    }
    public intlStorage: IntlStorage
    public filepath: string
    private isComplete: boolean = true;
    constructor (filepath: string) {
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
                    const PluginClass = noCacheRequire(PluginClassPath);
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
            vueHooks: {
                createdHook: new AsyncSeriesWaterfallHook(['createdInits']),
                methodsHook: new AsyncSeriesWaterfallHook(['methods']),
            }
        };
        this.webviewListenerHook = new SyncWaterfallHook(['listeners']);
        this.webviewParentListenerHook = new HookMap((type: string) => new AsyncParallelHook(["params"]));;
        this.commandHooks = new HookMap((type: string) => new SyncHook(["params"]));
        
    }
    public addDecoration(color: string, range: vscode.Range | vscode.DecorationOptions) {
        if (!this.decorations[color]) {
            this.decorations[color] = [];
        }
        this.decorations[color].push(range);
    }
    public pushError(errorNode: BaseErrorNode) {
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
            vscode.window.showWarningMessage(`解析失败 - ${this.filepath}` + err.stack);
            this.isComplete = true;
            return Promise.reject();
        }
    }
    private resetDataForConfig() {
        this.errors = [];
        this.plugins = [
            new WebViewPlugin()
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
                    vscode.window.showWarningMessage(`${this.filepath} - Babel解析失败` + err.stack);
                    rejects();
                } else {
                    resolve(err);
                }
            });
        })
    }
    
}