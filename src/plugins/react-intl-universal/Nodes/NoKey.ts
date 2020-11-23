
import BaseNode from '../../../model/BaseErrorNode';
import {ErrorNodeParam, HoverParams} from '../../../interface';
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
                    langs: [
                        {
                            langKey: 'zh_CN',
                            value: 'sdfsdfsdf'
                        },
                        {
                            langKey: 'zh_TW',
                            value: 'sdfsdfsdf'
                        }
                    ],
                    key: 'sdfasdfasd'
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
    replace(text: string) {
        this._replace(this.start, this.end, text);
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
                        type: 'nokey',
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