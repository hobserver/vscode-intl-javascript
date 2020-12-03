import { GlobalCommandParam } from '../../interface';
import Parser from '../../model/Parser';
export default class Command {
    private parser: Parser
    public listeners: {
        [command: string]: ((params: GlobalCommandParam) => void)[]
    } = {}
    constructor (parser: Parser) {
        this.parser = parser;
    }
    registerCommand(command: string, callback: (params: GlobalCommandParam) => void, isOnly = false) {
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
    removeCommand(command: string, callback: ((params: GlobalCommandParam) => void) | boolean, isOnly = false) {
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