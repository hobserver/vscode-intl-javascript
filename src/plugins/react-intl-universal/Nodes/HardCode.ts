
import BaseNode from '../../../model/BaseErrorNode';
import {ErrorNodeParam, HoverMenuCommandParam, HoverParams, Lang, MessageInfoResParams, StorageAddParams} from '../../../interface';
import * as vscode from 'vscode';
import * as path from 'path';
var CRC32 = require('crc-32'); 
import command from '../command';
export default class NoKeyErrorNode extends BaseNode {
    type = 'HardCode';
    extraParams
    constructor(params: ErrorNodeParam, extraParams: {
        text: string
        params?: string | null,
        getMethod: string
    }) {
        super(params);
        this.isRight = false;
        this.extraParams = extraParams;
        const { parser } = params;
        this.registerCommand(command.open_webview, async ({errorNodeId}: HoverMenuCommandParam) => {
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
                    key: path.relative(parser.config.projectDir,
                        path.dirname(this.filepath) + '/' + path.basename(this.filepath).substr(0, path.basename(this.filepath).lastIndexOf('.'))
                        ).split('/').join('_') + CRC32.str(this.extraParams.text)
                });
            }
        });
        this.registerCommand(command.HardCode_Haskey, async ({errorNodeId, key}: HoverMenuCommandParam) => {
            if (this.id === errorNodeId) {
                this._replace(this.start, this.end, `intl.get('${key}').d('${this.extraParams.text}')`);
            }
        });
        this.registerCommand(command.HardCode_Haskey_With_Brackets, async ({errorNodeId, key}: HoverMenuCommandParam) => {
            if (this.id === errorNodeId) {
                this._replace(this.start, this.end, `{intl.get('${key}').d('${this.extraParams.text}')}`);
            }
        });
    }
    getReplaceString(key: string, value: string) {
        return `intl.get('${key}'${this.extraParams.params === null ? '' : `, ${this.extraParams.params}`}).d('${value}')`;
    }
    async replaceAndSave(errorInfo: MessageInfoResParams, text?: string) {
        await super.replaceAndSave(errorInfo, text ? text : this.getReplaceString(errorInfo.key, errorInfo.langs[0].value as string));
    }
    async replaceAndSaveWithBrackets(errorInfo: MessageInfoResParams) {
        await this.replaceAndSave(errorInfo, `{${this.getReplaceString(errorInfo.key, errorInfo.langs[0].value as string)}}`);
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
        super.logError('硬编码文件');
    }
}