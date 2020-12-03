import Parser from '../../model/Parser';
import MenuCommand from './MenuCommand';
export default class CommandPlugin {
    options
    constructor(options?: any) {
        this.options = options;
    }
    apply(parser: Parser) {
        parser.registerService('menuCommand', new MenuCommand(parser));
    }
}