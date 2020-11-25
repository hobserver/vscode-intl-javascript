import { CheckResult, Lang, LangKey, StorageAddParams } from "../interface";
import Config from "./Config";
const fs = require("fs");
const path = require("path");
type UpdateParam = {
    [langKey in LangKey]: {
        [key: string]: string
    }
}

class LangStorage {
    
}
export default class IntlStorage{
    config: Config
    constructor(config: Config) {
        this.config = config;
    }
    public initLang() {
        this.initFilesIfNotExist(this.config.langs);
    }
    public updateKeyInLang(param: UpdateParam) {
        Object.keys(param).forEach((langKey: any, values) => {
            const langFile = this.getLangFile(langKey);
            const result = require(langFile);
            const newResult = JSON.stringify(Object.assign(result, values), null, 4);
            fs.writeFileSync(langFile, this.config.fileExt === 'json' ? newResult : `module.exports = ${newResult}`);
        });
    }   
    public checkKeyInLang(key: string, lang: LangKey, text?: string): {
        exist: boolean,
        ananimous: boolean
    } {
        const langFile = this.getLangFile(lang);
        const result = require(langFile);
        console.log(result, result[key], key, text, result[key] === text, {
            exist: !!result[key],
            ananimous: result[key] === text
        });
        return {
            exist: !!result[key],
            ananimous: result[key] === text
        };
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
    storeKeyAndValues(addParams: StorageAddParams[]) {
        // 以lang为索引，合并key
        // @ts-ignore
        const langs: {
            [langKey in LangKey]: {
                [key: string]: string
            } 
        } = {};
        addParams.forEach((addItem: StorageAddParams) => {
            if (!langs[addItem.lang]) {
                langs[addItem.lang] = {};
            }
            langs[addItem.lang][addItem.key] = addItem.text;
        });
        // @ts-ignore
        Object.keys(langs).forEach((langKey: LangKey) => {
            this.writeLangKeysToFile(langKey, langs[langKey]);
        });;
    }
    writeLangKeysToFile(langLey: LangKey, keys: {
        [key: string]: string
    }, isWhoile: boolean = false) {
        var writeInfo = keys;
        const langFile = this.getLangFile(langLey);
        if (!isWhoile) {
            const result = require(langFile);
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
        const result = require(langFile);
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