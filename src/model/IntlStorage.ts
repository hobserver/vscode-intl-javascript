import { CheckResult, IntlStorageStoreHookCallback, Lang, LangKey, StorageAddParams } from "../interface";
import Config from "./Config";
const fs = require("fs");
const path = require("path");
import noCacheRequire from '../utils/no-cache-require';
import {
    AsyncSeriesWaterfallHook,
    SyncHook,
    SyncWaterfallHook
} from 'tapable';
type UpdateParam = {
    [langKey in LangKey]: {
        [key: string]: string
    }
}
export default class IntlStorage {
    public hooks: {
        storeKeyToFile: AsyncSeriesWaterfallHook<[IntlStorageStoreHookCallback[]]>
    }
    config: Config
    constructor(config: Config) {
        this.config = config;
        this.hooks = {
            storeKeyToFile: new AsyncSeriesWaterfallHook(['listeners'])
        }
    }
    public initLang() {
        this.initFilesIfNotExist(this.config.langs);
    }
    public updateKeyInLang(param: UpdateParam) {
        Object.keys(param).forEach((langKey: any, values) => {
            const langFile = this.getLangFile(langKey);
            const result = noCacheRequire(langFile);
            const newResult = JSON.stringify(Object.assign(result, values), null, 4);
            fs.writeFileSync(langFile, this.config.fileExt === 'json' ? newResult : `module.exports = ${newResult}`);
        });
    }   
    public checkKeyInLang(key: string, lang: LangKey, text?: string): {
        exist: boolean,
        ananimous: boolean
    } {
        const langFile = this.getLangFile(lang);
        const result = noCacheRequire(langFile);
        return {
            exist: !!result[key],
            ananimous: result[key] === text
        };
    }
    public getValueKeyInLang(value: string, lang: LangKey): string | null {
        const langFile = this.getLangFile(lang);
        const result = noCacheRequire(langFile);
        var keyString = null;
        Object.keys(result).forEach((key) => {
            if (result[key] === value) {
                keyString = key;
            }
        });
        return keyString;
    }
    public checkKey(key: string, text?: string): CheckResult {
        var result: any = {};
        this.config.langs.forEach(lang => {
            if (lang.check) {
                result[lang.key] = this.checkKeyInLang(key, lang.key, text);
            }
        });
        return result;
    }
    public getValueKey(value: string): CheckResult {
        var result: any = {};
        this.config.langs.forEach(lang => {
            if (lang.check) {
                result[lang.key] = this.getValueKeyInLang(value, lang.key);
            }
        });
        return result;
    }
    async storeKeyAndValues(addParams: StorageAddParams[]) {
        // 以lang为索引，合并key
        // @ts-ignore
        const langs: {
            [langKey in LangKey]: {
                [key: string]: string
            } 
        } = {};
        const keyMap: {
            [key: string]: {
                [langKey in LangKey]: string
            } 
        } = {};
        addParams.forEach((addItem: StorageAddParams) => {
            if (!langs[addItem.lang]) {
                langs[addItem.lang] = {};
            }
            langs[addItem.lang][addItem.key] = addItem.text;
            if (!keyMap[addItem.key]) {
                // @ts-ignore
                keyMap[addItem.key] = {
                    [addItem.lang]: addItem.text
                };
            } else {
                keyMap[addItem.key][addItem.lang] = addItem.text;
            }
        });
        const listeners = await this.hooks.storeKeyToFile.promise([]);
        const keys = Object.keys(keyMap);
        for (var i = 0, len = keys.length; i < len; i++) {
            for (var j = 0, jlen = listeners.length; j < jlen; j++) {
                const callback = listeners[j];
                await callback(keys[i], keyMap[keys[i]]);
            }
        }
        // @ts-ignore
        Object.keys(langs).forEach(async (langKey: LangKey) => {
            this.writeLangKeysToFile(langKey, langs[langKey]);
        });
    }
    writeLangKeysToFile(langLey: LangKey, keys: {
        [key: string]: string
    }, isWhoile: boolean = false) {
        var writeInfo = keys;
        const langFile = this.getLangFile(langLey);
        if (!isWhoile) {
            const result = noCacheRequire(langFile);
            writeInfo = {
                ...result,
                ...keys
            }
        }
        const keyString = JSON.stringify(writeInfo, null, 4);
        fs.writeFileSync(langFile, this.config.fileExt === 'js' ? `module.exports=${keyString}` : keyString);
    }
    storeKeyAndValue(addParam: StorageAddParams) {
        this.storeKeyAndValues([addParam]);
    }
    public getKeyInLang(key: string, lang: LangKey): string {
        const langFile = this.getLangFile(lang);
        const result = noCacheRequire(langFile);
        return result[key];
    }
    private getLangFile(lang: LangKey): string {
        const langFile = path.join(this.config.localeDir, `${lang}.${this.config.fileExt}`);
        return langFile;
    }
    private initFilesIfNotExist(langs: Lang[]) {
        langs.forEach(lang => {
            const langFile = this.getLangFile(lang.key);
            if (!fs.existsSync(langFile)) {
                fs.writeFileSync(langFile, this.config.fileExt === 'js' ? `module.exports={}` : '{}');
            }
        });
    }
}