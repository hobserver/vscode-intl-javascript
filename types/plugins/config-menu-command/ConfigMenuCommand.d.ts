import { CommonCommandParam, Parser } from '../../interface';
import CommonCommand from '../../model/CommonCommand';
export default class ConfigCommonCommand extends CommonCommand<CommonCommandParam> {
    constructor(parser: Parser);
    menus: {
        key: string;
        label: string;
        description: string;
    }[];
    addMenu(params: {
        label: string;
        description: string;
        key: string;
        callback: (params: CommonCommandParam) => void;
    }): void;
}
