
import BaseNode from '../../../model/BaseErrorNode';
import { ErrorNodeParam, LangKey, CheckResult, HoverCommandMenuItem, Lang, HoverParams, HoverMenuCommandParam, MessageInfoResParams} from '../../../interface';
import * as vscode from 'vscode';
import command from '../command';
export default class HasKeyErrorNode extends BaseNode {
    extraParams
    checkResult: CheckResult = {}
    firstErrorLang?: Lang
    logs: string[] = [];
    isCheck: boolean = false;
    constructor(position: ErrorNodeParam, extraParams: {
        key: string
        text: string
        keyStart: number
        keyEnd: number
        textStart: number
        textEnd: number
        params?: any
    }) {
        super(position);
        this.extraParams = extraParams;
        this.registerCommand(command.open_webview, async ({errorNodeId}: HoverMenuCommandParam) => {
            if (this.id === errorNodeId) {
                await this.parser.webview.open();
                await this.sendErrorNodoInfoToWebwiew({
                    filePath: this.filepath,
                    id: this.id,
                    langs: this.parser.config.langs.map((langItem: Lang, key) => {
                        return {
                            langKey: langItem.key,
                            value: key === 0 ? this.extraParams.text : this.parser.intlStorage.getKeyInLang(this.extraParams.key, langItem.key)
                        }
                    }),
                    key: this.extraParams.key
                });
            }
        });
        this.registerCommand(command.replace_value_to_key, async ({errorNodeId, key}: HoverMenuCommandParam) => {
            if (this.id === errorNodeId) {
                this._replace(this.extraParams.textStart, this.extraParams.textEnd,
                    "'" + this.parser.intlStorage.getKeyInLang(key, this.parser.config.getFirstLangKey()) + "'");
            }
        });
        this.registerCommand(command.replace_key_to_value_key, async ({errorNodeId, key}: HoverMenuCommandParam) => {
            if (this.id === errorNodeId) {
                this._replace(this.extraParams.keyStart, this.extraParams.keyEnd,
                    "'" + this.parser.intlStorage.getValueKeyInLang(this.extraParams.text, this.parser.config.getFirstLangKey()) + "'");
            }
        });
    }
    getLog() {

    }
    async replaceAndSave(errorInfo: MessageInfoResParams, text?: string) {
        super.replaceAndSave(errorInfo, text ? text : `intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')`);
    }
    replaceAndSaveWithBrackets(errorInfo: MessageInfoResParams) {
        this.replaceAndSave(errorInfo, `{intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')}`);
    }
    check() {
        const {intlStorage} = this.parser;
        const {langMap} = this.parser.config;
        const checkResult = intlStorage.checkKey(this.extraParams.key, this.extraParams.text);
        this.checkResult = checkResult;
        Object.keys(checkResult).forEach((langKey: string) => {
            const langItem = langMap[langKey as LangKey];
            if (langItem && langItem.name) {
                const checkItemResult = checkResult[langKey as LangKey];
                if (!checkItemResult.exist) {
                    if (!this.firstErrorLang) {
                        this.firstErrorLang = langItem;
                    }
                    this.logs.push(langItem.name  + ' 缺少');
                } else if (langKey === this.parser.config.getFirstLangKey()){
                    if (!checkItemResult.ananimous) {
                        this.logs.push(langItem?.name + ' 不一致');
                    }
                }
            }
        });
    }
    logError() {
        if (!this.isCheck) {
            this.check();
        }
        this.appendLog(this.logs.join(',') + ' ' + this.getErrorLine());
    }
    showMenu({
        position,
        document,
        offset
    }: HoverParams): vscode.ProviderResult<vscode.Hover> {
        if (offset > this.start && offset < this.end) {
            // 查看key是否存在
            const keyResult = this.parser.intlStorage.checkKey(this.extraParams.key, this.extraParams.text);
            var menus: HoverCommandMenuItem[] = [
                {
                    name: '打开编辑界面',
                    params: {
                        filePath: this.filepath,
                        command: command.open_webview,
                        errorNodeId: this.id
                    }
                }
            ]
            const firstCheckResult = keyResult[this.parser.config.getFirstLangKey()];
            if (firstCheckResult.exist && !firstCheckResult.ananimous) {
                menus = menus.concat([
                    {
                        name: 'key存在，但是内容不一致，点击替换成key的值',
                        params: {
                            filePath: this.filepath,
                            command: command.replace_value_to_key,
                            errorNodeId: this.id,
                            key: this.extraParams.key
                        }
                    }
                ]);
            }
            const firstLangValueKey = this.parser.intlStorage.getValueKeyInLang(this.extraParams.text, this.parser.config.getFirstLangKey());
            if (!firstCheckResult.exist && firstLangValueKey) {
                menus = menus.concat([
                    {
                        name: 'key不存在，value存在对应key，点击替换成新的key',
                        params: {
                            filePath: this.filepath,
                            command: command.replace_key_to_value_key,
                            errorNodeId: this.id,
                            key: this.extraParams.key
                        }
                    }
                ]);
            }
            return this.createHoverCommandMenu(menus);
        }
        return;
    }
    putColor() {
        if (!this.isCheck) {
            this.check();
        }
        // 获取第一个不合格的颜色
        const activeEditor = this.parser.utils.getActiveEditor();
        const {document} = activeEditor;
        if (document) {
            // 缺少那个，显示那个颜色，只有两个都满足才不会着色
            if (this.checkResult) {
                var isOK: boolean = true;
                var firstErrorColor: string = 'red';
                const checkResult = Object.keys(this.checkResult);
                for (var i = 0; i < checkResult.length; i++) {
                    const langKey = checkResult[i];
                    if (i === 0) {
                        if (!(this.checkResult[langKey].exist && this.checkResult[langKey].ananimous)) {
                            isOK = false;
                        }
                    } else if (!this.checkResult[langKey].exist) {
                        isOK = false;
                    }
                    if (!isOK) {
                        firstErrorColor = this.parser.config.langMap[langKey as LangKey].color;
                        break;
                    }
                }
                if (!isOK) {
                    this.parser.addDecoration(firstErrorColor, {
                        range: new vscode.Range(
                            document.positionAt(this.start),
                            document.positionAt(this.end),
                        ),
                        renderOptions: {
                            after: {
                                color: 'rgba(153, 153, 153, .7)',
                                contentText: this.logs.join(', '),
                                fontWeight: 'normal',
                                fontStyle: 'normal'
                            }
                        }
                    });
                }
                
            }
            
        }
    }
}
// 美杜莎langs里面的文件，和程序的文件，那个重要
// 要有一个同步美杜莎的menu


// 19. 代理模式（代理设计模式）详解  侧重调用，深入交流  --- 通过合同访问公司 访问国家机密文件，访问别人女朋友，访问对方内部机密数据，或者访问犯罪人员 （男朋友，监狱，集团收购公司后）
// 20. 适配器模式（Adapter模式）详解 侧重得到  铁打的营盘流水的兵 --- 出国交流（插头转化器） 改革（政府部门变更）不同显示器公司之间进行转化，所有适配器尽量少用，如果用的多，说明设计的很不好，这个行业没有一个标准，用户就很痛苦，所以要尽量设计好同类对象对外提供接口时，一定要考虑通用和长远

// 21. 桥接模式（Bridge模式）详解
// 22. 装饰模式（装饰设计模式）详解  --- 可以理解成机器，磨具，同样的材料，磨具不一样，展示就大不相同，生产材料是重点，生产磨具也是重点
// 23. 外观模式（Facade模式）详解 所见即所得，只提供看得到的接口，看不到的，就不要提供
// 24. 享元模式（详解版）出租模式，临时用用，共享使用
// 25. 组合模式（详解版）学校这种，学校的特点是什么，目的很明确，实例对象很多，但是流程也很单一


// 生活中的各种场景
// 合同合作，时代交替，我们怎么变更，我们购买的商品，我们租的商品，我们怎么用的商品，我们怎么处理大量的孩子，学生