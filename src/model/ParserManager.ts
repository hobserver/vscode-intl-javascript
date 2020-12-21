import { HoverParams } from '../interface';
import Parser from './Parser';
import utils from '../utils/index';
import * as vscode from 'vscode';
var readfiles = require('node-readfiles');

var CRC32 = require('crc-32'); 
import * as path from 'path';
class ParserManger {
    static instance: ParserManger
    caches: {
        [filepath: string]: Parser
    } = {};
    lastUpdateTime = new Date().getTime();
    static getSingleInstance(): ParserManger {
        if (ParserManger.instance) {
            return ParserManger.instance;
        }
        ParserManger.instance = new ParserManger();
        return ParserManger.instance;
    }
    async handleTimerQueue() {
        const filePath = utils.getCurrentFilePath();
        if (filePath) {
            const parser = this.caches[filePath];
            if (parser) {
                if (new Date().getTime() - this.lastUpdateTime > 1 * 1000) {
                    const updateQueues = await parser.updateHook.promise([]);
                    for (var i = 0, len = updateQueues.length; i < len; i++) {
                        updateQueues[i]();
                    }
                }
            }
        }
    }
    async parseCurrentFile(): Promise<Parser> {
        const filePath = utils.getCurrentFilePath();
        if (filePath) {
            return this.parseFile(filePath);
        } else {
            return Promise.reject();
        }
    }
    async parseDir(dirName: string) {
        // 获取所有文件，然后出个排查
        await utils.diagnostic.clear();
        return readfiles(dirName, {
            filter: [
                '.ts$',
                '.tsx$',
                '.js$',
                '.jsx$',
            ]
        }, (err: any, filename: any) => {
            if (err) throw err;
        }).then(async (files: any) => {
            var index = 0;
            var run = () => {
                const filename = path.join(dirName, files[index]);
                this.parseFile(filename).then((parser) => {
                    index++;
                    parser.logErrors();
                    if (index < files.length) {
                        run();
                    }
                });
            }
            run();
        })
    }
    parseFile(filepath: string) {
        if (!this.caches[filepath]) {
            this.caches[filepath] = new Parser(filepath);
        }
        return this.caches[filepath].parse();
    }
    showHoverMenu(params: HoverParams): vscode.ProviderResult<vscode.Hover> {
        const fileName = params.document.fileName;
        var errorHoverMenus;
        for (var i = 0; i < this.caches[fileName].errors.length; i++) {
            const tempErrorHoverMenus = this.caches[fileName].errors[i].showMenu(params);
            if (tempErrorHoverMenus) {
                errorHoverMenus = tempErrorHoverMenus;
            }
        }
        return errorHoverMenus;
    }
}
export default ParserManger;