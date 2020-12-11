import { CheckResult, IntlStorageStoreHookCallback, LangKey, StorageAddParams } from "../interface";
import Config from "./Config";
import { AsyncSeriesWaterfallHook } from 'tapable';
declare type UpdateParam = {
    [langKey in LangKey]: {
        [key: string]: string;
    };
};
export default class IntlStorage {
    hooks: {
        storeKeyToFile: AsyncSeriesWaterfallHook<[IntlStorageStoreHookCallback[]]>;
    };
    config: Config;
    constructor(config: Config);
    initLang(): void;
    updateKeyInLang(param: UpdateParam): void;
    checkKeyInLang(key: string, lang: LangKey, text?: string): {
        exist: boolean;
        ananimous: boolean;
    };
    getValueKeyInLang(value: string, lang: LangKey): string | null;
    checkKey(key: string, text?: string): CheckResult;
    getValueKey(value: string): CheckResult;
    storeKeyAndValues(addParams: StorageAddParams[]): Promise<void>;
    writeLangKeysToFile(langLey: LangKey, keys: {
        [key: string]: string;
    }, isWhoile?: boolean): void;
    storeKeyAndValue(addParam: StorageAddParams): void;
    getKeyInLang(key: string, lang: LangKey): string;
    private getLangFile;
    private initFilesIfNotExist;
}
export {};
