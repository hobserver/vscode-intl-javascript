import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Parser from "./Parser";
import {Lang, LangKey} from '../interface';
import WebView from '../plugins/webview';
import config from '../config';
import noCacheRequire from '../utils/no-cache-require';
export default class {
    public langs: Lang[] = [];
    public fileExt = 'json';
    public fileReg = /\.(tsx|ts|js|vue)$/
    public isCurrentFileLogError: boolean = false
    public localeDir: string | null = null;

    // 上面的属性是需要传进来的配置
    public projectDir: string = '';
    public parser: Parser
    public filepath: string;
    // @ts-ignore
    public langMap: {
        [key in LangKey]: Lang
    } = {};
    public publisher = config.publisher;
    public name = config.name;
    constructor(parser: Parser, filepath: string) {
        this.parser = parser;
        this.filepath = filepath;
    }
    init() {
        // 找文件
        const configFile = this.findConfigFile();
        if (configFile) {
            return this.handleConfigFile(configFile);
        } else {
            return Promise.reject();
        }
    }
    getFirstLangKey() {
        return this.langs[0].key;
    }
    findConfigFile() {
        const vsConfigFile = vscode.workspace.getConfiguration(this.name);
        var localConfigFileName = vsConfigFile.get('localConfigFileName');
        const findConfigFile = (fileDir: string): string | null => {
            if (!path.isAbsolute(fileDir)) {
                return null;
            }
            if (fileDir == '/') {
                return null;
            } else if (
                !fs.existsSync(`${fileDir}/${localConfigFileName}`)
            ) {
                return findConfigFile(
                    path.dirname(fileDir)
                );
            } else {
                this.projectDir = fileDir;
                return `${fileDir}/${localConfigFileName}`;
            }
        }
        const configFile = findConfigFile(path.dirname(this.filepath));
        return configFile;
    }
    async getTempDir(configFile: string | null): Promise<string> {
        if (!configFile) {
            configFile = this.findConfigFile();
        }
        if (configFile) {
            return path.join(path.dirname(configFile), '.locale');
        } else {
            return Promise.reject();
        }
    }
    async handleConfigFile(configFile: string) {
        const initConfig = noCacheRequire(configFile);
        const config = initConfig(this);
        this.langs = config.langs.map((item: Lang) => {
            return Object.assign({
                color: 'red',
                check: true
            }, item);
        });
        this.langs.forEach(langItem => {
            this.langMap[langItem.key] = langItem;
        });
        if (config.fileExt) {
            this.fileExt = config.fileExt;
        }
        const tempLocal = await this.getTempDir(configFile);
        if (!fs.existsSync(tempLocal)) {
            fs.mkdirSync(tempLocal);
        }
        if (!config.localeDir) {
            const langDir = path.join(tempLocal, 'langs');
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir);
            }
            this.localeDir = langDir;
        } else {
            this.localeDir = config.localeDir;
        }
        if (config.plugins) {
            this.parser.plugins = this.parser.plugins.concat(config.plugins);
        }
    }
}