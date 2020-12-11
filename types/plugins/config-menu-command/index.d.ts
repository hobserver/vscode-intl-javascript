import Parser from '../../model/Parser';
export default class CommandPlugin {
    options: any;
    constructor(options?: any);
    apply(parser: Parser): void;
}
