import Parser from './Parser';
export default class CommandCommand<CommandParams> {
    private parser;
    listeners: {
        [command: string]: ((params: CommandParams) => void)[];
    };
    constructor(parser: Parser);
    registerCommand(command: string, callback: (params: CommandParams) => void, isOnly?: boolean): void;
    removeCommand(command: string, callback: ((params: CommandParams) => void) | boolean, isOnly?: boolean): void;
}
