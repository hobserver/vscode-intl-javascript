import Parser from "./Parser";
import { Lang, LangKey } from '../interface';
export default class {
    langs: Lang[];
    fileExt: string;
    fileReg: {};
    isCurrentFileLogError: boolean;
    localeDir: string | null;
    parser: Parser;
    filepath: string;
    langMap: {
        [key in LangKey]: Lang;
    };
    publisher: string;
    name: string;
    constructor(parser: Parser, filepath: string);
    init(): any;
    getFirstLangKey(): any;
    findConfigFile(): string | null;
    handleConfigFile(configFile: string): any;
}
