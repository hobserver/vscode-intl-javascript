import Parser from '../../model/Parser';
import CommonCommand from '../../model/CommonCommand';
import { HoverMenuCommandParam } from '../../interface';
export default class CommandPlugin {
    options
    constructor(options?: any) {
        this.options = options;
    }
    apply(parser: Parser) {
        parser.registerService('hoverMenuCommand', new CommonCommand<HoverMenuCommandParam>(parser));
    }
}