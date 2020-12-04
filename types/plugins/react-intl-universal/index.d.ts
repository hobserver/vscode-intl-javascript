import Config from '../../model/Config';
import IntlStorage from '../../model/IntlStorage';
import Parser from '../../model/Parser';
declare const _default: {
    new (options: any): {
        options: {
            defaultLangReg: RegExp;
            defaultFuncNameReg: RegExp;
            getFuncNameReg: RegExp;
        };
        config?: Config | undefined;
        parser?: Parser | undefined;
        intlStorage?: IntlStorage | undefined;
        apply(parser: Parser): void;
        getNodeValue(node: any): string;
        checkNode(nodePath: any): void;
    };
};
export = _default;
