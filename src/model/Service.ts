import ErrorNode from './BaseErrorNode';
import Parser from './Parser';
export default class Service {
    hook = {};
    parser: Parser
    constructor (parser: Parser) {
        this.parser = parser;
    }
}