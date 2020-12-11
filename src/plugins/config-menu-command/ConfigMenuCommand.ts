import { CommonCommandParam, Parser } from '../../interface';
import CommonCommand from '../../model/CommonCommand';
export default class ConfigCommonCommand extends CommonCommand<CommonCommandParam> {
    constructor(parser: Parser) {
        super(parser);
    }
    menus: {
        key: string,
        label: string,
        description: string,
    }[] = [];
    addMenu(params: {
        label: string,
        description: string,
        key: string,
        callback: (params: CommonCommandParam) => void
    }) {
        this.menus.push({
            key: params.key,
            label: params.label,
            description: params.description,
        });
        this.registerCommand(params.key, params.callback);
    }
}