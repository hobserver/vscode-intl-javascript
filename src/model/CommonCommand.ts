import Parser from './Parser';
export default class CommandCommand<CommandParams> {
    private parser: Parser
    public listeners: {
        [command: string]: ((params: CommandParams) => void)[]
    } = {}
    constructor (parser: Parser) {
        this.parser = parser;
    }
    triggerCommand(command: string, params: any) {
        const listeners = this.listeners[command];
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](params);
        }
    }
    registerCommand(command: string, callback: (params: CommandParams) => void, isOnly = false) {
        if (isOnly) {
            this.listeners[command] = [callback];
        } else {
            if (!this.listeners[command]) {
                this.listeners[command] = [];
            }
            if (!this.listeners[command].find(item => {
                return item === callback
            })) {
                this.listeners[command].push(callback);
            }
        }
    }
    removeCommand(command: string, callback: ((params: CommandParams) => void) | boolean, isOnly = false) {
        if (typeof callback === 'boolean') {
            isOnly = true;
        }
        if (isOnly) {
            this.listeners[command] = [];
        } else {
            if (!this.listeners[command]) {
                this.listeners[command] = [];
            }
            this.listeners[command] = this.listeners[command].filter(callbackItem => {
                return callbackItem != callback;
            });
        }
    }
}