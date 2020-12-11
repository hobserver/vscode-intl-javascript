import Parser from '../../model/Parser';
import ConfigMenuCommand from './ConfigMenuCommand';
import { CommonCommandParam } from '../../interface';
export default class CommandPlugin {
    options
    constructor(options?: any) {
        this.options = options;
    }
    apply(parser: Parser) {
        parser.registerService('configMenuCommand', new ConfigMenuCommand(parser));
    }
}