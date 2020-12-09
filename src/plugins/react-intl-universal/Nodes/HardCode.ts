
import BaseNode from '../../../model/BaseErrorNode';
import {ErrorNodeParam, GlobalCommandParam, HoverParams, Lang, MessageInfoResParams, StorageAddParams} from '../../../interface';
import * as vscode from 'vscode';
import command from '../command';
export default class NoKeyErrorNode extends BaseNode {
    type = 'HardCode';
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
        this.registerCommand(command.open_webview, async ({errorNodeId}: GlobalCommandParam) => {
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
        this.registerCommand(command.HardCode_Haskey, async ({errorNodeId, key}: GlobalCommandParam) => {
            if (this.id === errorNodeId) {
                this._replace(this.start, this.end, `intl.get('${key}').d('${this.extraParams.text}')`);
            }
        });
        this.registerCommand(command.HardCode_Haskey_With_Brackets, async ({errorNodeId, key}: GlobalCommandParam) => {
            if (this.id === errorNodeId) {
                this._replace(this.start, this.end, `{intl.get('${key}').d('${this.extraParams.text}')}`);
            }
        });
    }
    async replaceAndSave(errorInfo: MessageInfoResParams, text?: string) {
        await super.replaceAndSave(errorInfo, text ? text : `intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')`);
    }
    async replaceAndSaveWithBrackets(errorInfo: MessageInfoResParams) {
        await this.replaceAndSave(errorInfo, `{intl.get('${errorInfo.key}').d('${errorInfo.langs[0].value}')}`);
    }
    showMenu({
        position,
        document,
        offset
    }: HoverParams): vscode.ProviderResult<vscode.Hover> {
        if (offset > this.start && offset < this.end) {
            const keyMap = this.parser.intlStorage.getValueKey(this.extraParams.text);
            const key = keyMap[this.parser.config.getFirstLangKey()];
            if (key) {
                // 如果有key
                return this.createHoverCommandMenu([
                    {
                        name: '已经存在key，点击替换',
                        params: {
                            filePath: this.filepath,
                            command: command.HardCode_Haskey,
                            errorNodeId: this.id,
                            key
                        }
                    },
                    {
                        name: '已经存在key，点击替换, 加大括号',
                        params: {
                            filePath: this.filepath,
                            command: command.HardCode_Haskey_With_Brackets,
                            errorNodeId: this.id,
                            key
                        }
                    }
                ]);
            } else {
                // 如果没有key
                return this.createHoverCommandMenu([
                    {
                        name: '硬编码',
                        params: {
                            filePath: this.filepath,
                            command: command.open_webview,
                            errorNodeId: this.id
                        }
                    }
                ]);
            }
        }
        return;
    }
    logError() {
        this.appendLog(`硬编码文件 ${this.filepath}:${this.startRow}:${this.startCol}`);
    }
}