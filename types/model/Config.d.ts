import Parser from "./Parser";
import { Lang, LangKey } from '../interface';
export default class {
    langs: Lang[];
    fileExt: string;
    fileReg: RegExp;
    isCurrentFileLogError: boolean;
    localeDir: string | null;
    projectDir: string;
    parser: Parser;
    filepath: string;
    langMap: {
        [key in LangKey]: Lang;
    };
    publisher: string;
    name: string;
    constructor(parser: Parser, filepath: string);
    init(): Promise<void>;
    getFirstLangKey(): LangKey;
    findConfigFile(): string | null;
    checkConfigVscodeIntlJavascriptVersion(configFile: string): Promise<void>;
    getTempDir(configFile: string | null): Promise<string>;
    handleConfigFile(configFile: string): Promise<void>;
}
