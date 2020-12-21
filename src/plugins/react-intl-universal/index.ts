
import { LangKey, MessageInfoResParams } from '../../interface';
import BaseErrorNode from '../../model/BaseErrorNode';
import Config from '../../model/Config';
import IntlStorage from '../../model/IntlStorage';
import Parser from '../../model/Parser';
import HasKeyErrorNode from './Nodes/HasKey';
var generate = require('@babel/generator');
const path = require('path');
const t = require("@babel/types");
import HardCodeErrorNode from './Nodes/HardCode';
export = class {
    options: {
        defaultLang: LangKey
        defaultFuncNameReg: RegExp
        getFuncNameReg: RegExp
    }
    // @ts-ignore
    private langRegexp: {
        [langKey in LangKey]: RegExp
    } = {
        zh_CN: /[\u4e00-\u9fa5]/
    }
    config?: Config;
    parser?: Parser
    intlStorage?: IntlStorage
    constructor(options: any) {
        this.options = options;
        
    }
    apply(parser: Parser) {
        this.config = parser.config;
        this.parser = parser;
        const {babelHooks, intlStorage, webViewHooks} = parser;
        this.intlStorage = intlStorage;
        babelHooks.babelPluginHook.tap('plugin', ((plugins: any[]) => {
            return plugins.concat([
                {
                    visitor: {
                        JSXText: (nodePath: any) => {
                            this.checkNode(nodePath);
                        },
                        StringLiteral: (nodePath: any) => {
                            this.checkNode(nodePath);
                        },
                        TemplateElement: (nodePath: any) => {
                            this.checkNode(nodePath);
                        },
                    }
                },
            ]);
        }));
        this.parser.webview.addParentListener('onErrorInfoReplace', (errorInfo: MessageInfoResParams) => {
            // 找到对应的ErrorNode 节点，然后调用replace方法
            const errorNode: any = this.parser?.parserManager.caches[errorInfo.filePath]?.errors.find((item: BaseErrorNode) => {
                return item.id === errorInfo.id;
            });
            errorNode?.replaceAndSave(errorInfo);
        });
        this.parser.webview.addParentListener('onErrorInfoReplaceWithKuohao', (errorInfo: MessageInfoResParams) => {
            // 找到对应的ErrorNode 节点，然后调用replace方法
            const errorNode: any = this.parser?.parserManager.caches[errorInfo.filePath]?.errors.find((item: BaseErrorNode) => {
                return item.id === errorInfo.id;
            });
            errorNode?.replaceAndSaveWithBrackets(errorInfo);
        });
        webViewHooks.btnHook.tapPromise('replace', async (btns: any[]) => {
            return btns.concat([
                {
                    key: 'replace',
                    text: '替换',
                    functionConstructorParams: [
                        'errorInfo',
                        `
                            triggerParentListener('onErrorInfoReplace', errorInfo);
                        `
                    ]
                },
                {
                    key: 'replaceWithBrackets',
                    text: '替换并加大括号',
                    functionConstructorParams: [
                        'errorInfo',
                        `
                            triggerParentListener('onErrorInfoReplaceWithKuohao', errorInfo);
                        `
                    ]
                }
            ]);
        });
    }
    getNodeValue (node: any) {
        var value = '';
        if (node.type === 'TemplateElement') {
            value = node.value.raw;
        } else {
            value = node.value
        }
        return value.trim()
    }
    checkNode(nodePath: any) {
        let nodeValue = this.getNodeValue(nodePath.node);
        if (
            this.langRegexp[this.options.defaultLang].test(nodeValue)
        ) {
            const filePath = nodePath.hub.file.opts.filename;
            const intlNode = nodePath.findParent((item: any) => {
                const node = item.node;
                if (
                    node.type ===  "CallExpression"
                    && node.callee.type === "MemberExpression"
                    && this.options.defaultFuncNameReg.test(node.callee.property.name)
                ) {
                    const objNode = node.callee.object;
                    if (
                        objNode.type === "CallExpression"
                        && this.options.getFuncNameReg.test(objNode.callee.property.name)
                        && objNode.callee.object.type === "Identifier"
                        && objNode.callee.object.name === "intl"
                    ) {
                        return true;
                    }
                }
                return false;
            });
            let hasParams = false;
            if (intlNode) {
                const intlKey = intlNode.node.callee.object.arguments[0].value;
                const intlText = generate.default(intlNode.node.arguments[0]).code.slice(1, -1);
                const locNode = intlNode.node.loc;
                if (
                    intlNode.node.start
                    || intlNode.node.end
                    || locNode.start
                    || locNode.end
                ) {
                    const keyNode = intlNode.node.callee.object.arguments[0];
                    const textNode = intlNode.node.arguments[0];
                    // 这里因为会重复创建很多个ErrorNode, 不太好解决
                    this.parser?.pushError(new HasKeyErrorNode({
                        parser: this.parser,
                        filepath: filePath,
                        start: intlNode.node.start,
                        end: intlNode.node.end,
                        startRow: locNode.start.line,
                        startCol: locNode.start.column,
                        endRow: locNode.end.line,
                        endCol: locNode.end.column,
                    }, {
                        key: intlKey,
                        text: intlText,
                        keyStart: keyNode.start,
                        keyEnd: keyNode.end,
                        textStart: textNode.start,
                        textEnd: textNode.end,
                    }));
                }
            } else { // 硬编码
                let node = nodePath.node;
                let replaceParams = null;
                // 对模板字符串单独处理
                if (node.type === 'TemplateElement') {
                    let newNodePath = nodePath.findParent((item: any) => {
                        return item.node.type === 'TemplateLiteral';
                    });
                    if (newNodePath) {
                        node = newNodePath.node;
                        const properties: any = [];
                        var params: any = [];
                        node.expressions.forEach((value: any, index: any) => {
                            params.push(`{key${index}}`);
                            properties.push(t.objectProperty(t.identifier(`key${index}`), value));
                        });
                        if (properties.length > 0) {
                            hasParams = true;
                            replaceParams = generate.default(t.objectExpression(properties), {compact: true}).code;
                        }
                        const replaceTextArr: any = [];
                        node.quasis.forEach((item: any) => {
                            replaceTextArr.push(item.value.raw);
                            if (params.length) {
                                replaceTextArr.push(params.shift());
                            }
                        });
                        nodeValue = replaceTextArr.join('');
                    }
                }
                if (node && node.loc) { 
                    const locNode = node.loc;
                    if (
                        node.start
                        || node.end
                        || locNode.start
                        || locNode.end
                    ) {
                        const isHtml = /<(?:html|head|title|base|link|meta|style|script|noscript|template|body|section|nav|article|aside|h1|h2|h3|h4|h5|h6|header|footer|address|main|p|hr|pre|blockquote|ol|ul|li|dl|dt|dd|figure|figcaption|div|a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img|iframe|embed|object|param|video|audio|source|track|canvas|map|area|svg|math|table|caption|colgroup|col|tbody|thead|tfoot|tr|td|th|form|fieldset|legend|label|input|button|select|datalist|optgroup|option|textarea|keygen|output|progress|meter|details|summary|menuitem|menu)[^>]*>/;
                        this.parser?.pushError(new HardCodeErrorNode({
                            parser: this.parser,
                            filepath: filePath,
                            start: node.start,
                            end: node.end,
                            startRow: locNode.start.line,
                            startCol: locNode.start.column,
                            endRow: locNode.end.line,
                            endCol: locNode.end.column,
                        }, {
                            text: nodeValue,
                            params: replaceParams,
                            getMethod: isHtml.test(nodeValue) ? 'getHTML': 'get'
                        }));
                    } else {
                        throw(new Error('缺少位置信息'));
                    }
                }
            }
        }
    }
} 