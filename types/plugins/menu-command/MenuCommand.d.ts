import { GlobalCommandParam } from '../../interface';
import Parser from '../../model/Parser';
export default class Command {
    private parser;
    listeners: {
        [command: string]: ((params: GlobalCommandParam) => void)[];
    };
    constructor(parser: Parser);
    registerCommand(command: string, callback: (params: GlobalCommandParam) => void, isOnly?: boolean): void;
    removeCommand(command: string, callback: ((params: GlobalCommandParam) => void) | boolean, isOnly?: boolean): void;
}
