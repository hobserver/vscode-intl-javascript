
import BaseNode from '../../../model/BaseErrorNode';
import { ErrorNodeParam, LangKey, CheckResult, Lang} from '../../../interface';
import * as vscode from 'vscode';
export default class HasKeyErrorNode extends BaseNode {
    extraParams
    checkResult?: CheckResult
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
    }
    getLog() {

    }
    check() {
        const {intlStorage} = this.parser;
        const {langMap} = this.parser.config;
        const checkResult = intlStorage.checkKey(this.extraParams.key, this.extraParams.text);
        this.checkResult = checkResult;
        Object.keys(checkResult).forEach((langKey: string) => {
            const langItem = langMap[langKey as LangKey];
            if (langItem && langItem.name) {
                if (!checkResult[langKey as LangKey].exist) {
                    if (!this.firstErrorLang) {
                        this.firstErrorLang = langItem;
                    }
                    this.logs.push(langItem.name  + ' 缺少');
                } else {
                    this.logs.push(langItem?.name + ' 不一致');
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
    putColor() {
        if (!this.isCheck) {
            this.check();
        }
        // 获取第一个不合格的颜色
        const activeEditor = this.parser.utils.getActiveEditor();
        const {document} = activeEditor;
        if (document) {
            this.parser.addDecoration('red', {
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