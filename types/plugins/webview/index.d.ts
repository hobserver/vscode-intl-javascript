import Parser from '../../model/Parser';
export default class WebViewPlugin {
    options: any;
    constructor(options?: any);
    initWebviewApi(parser: Parser): void;
    apply(parser: Parser): any;
}
