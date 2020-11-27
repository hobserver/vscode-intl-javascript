
import BaseNode from '../../../model/BaseErrorNode';
import {ErrorNodeParam, HoverParams, Lang, MessageInfoResParams, StorageAddParams} from '../../../interface';
import * as vscode from 'vscode';
export default class NoKeyErrorNode extends BaseNode {
    type = 'nokey';
    extraParams
    constructor(params: ErrorNodeParam, extraParams: {
        text: string
        params?: {
            [key: string]: any
        },
        getMethod: string
    }) {
        super(params);
        this.extraParams = extraParams;
        const { parser } = params;
        parser.commandHooks.for('nokey').tap('nokey', async (errorNodeId: any) => {
            if (this.id === errorNodeId) {
                await parser.webview.open();
                await this.sendErrorNodoInfoToWebwiew({
                    filePath: this.filepath,
                    id: this.id,
                    langs: this.parser.config.langs.map((langItem: Lang, key) => {
                        return {
                            langKey: langItem.key,
                            value: key === 0 ? this.extraParams.text : ''
                        }
                    }),
                    key: ''
                });
            }
            
        });
    }
    isShowHover({
        offset
    }: HoverParams): boolean {
        if (offset > this.start && offset < this.end) {
            return true;
        } else {
            return false;
        }
    }
    replace(errorInfo: MessageInfoResParams) {
        var addParams: StorageAddParams[] = [];
        errorInfo.langs.forEach(item => {
            if (item.value) {
                addParams.push({
                    key: errorInfo.key,
                    text: item.value,
                    lang: item.langKey
                });
            }
        });
        this.parser.intlStorage.storeKeyAndValues(addParams);
        this._replace(this.start, this.end, `intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')`);
    }
    replaceWithBrackets(errorInfo: MessageInfoResParams) {
        this._replace(this.start, this.end, `{intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')}`);
    }
    showMenu({
        position,
        document,
        offset
    }: HoverParams): vscode.ProviderResult<vscode.Hover> {
        if (offset > this.start && offset < this.end) {
            return this.createHoverCommandMenu([
                {
                    name: '硬编码',
                    params: {
                        filePath: this.filepath,
                        command: 'nokey',
                        errorNodeId: this.id
                    }
                }
            ]);
        }
        return;
    }
    logError() {
        this.appendLog(`硬编码文件 ${this.filepath}:${this.startRow}:${this.startCol}`);
    }
}