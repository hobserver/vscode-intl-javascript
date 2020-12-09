import { HoverParams, ParseFileParam } from '../interface';
import Parser from './Parser';
import utils from '../utils/index';
import * as vscode from 'vscode';
var readfiles = require('node-readfiles');
import * as path from 'path';
class ParserManger {
    static instance: ParserManger
    caches: {
        [filepath: string]: Parser
    } = {};
    static getSingleInstance(): ParserManger {
        if (ParserManger.instance) {
            return ParserManger.instance;
        }
        ParserManger.instance = new ParserManger();
        return ParserManger.instance;
    }
    parseCurrentFile() {
        const filePath = utils.getCurrentFilePath();
        if (filePath) {
            this.parseFile(filePath, {
                isPutColor: true,
                isShowLog: false
            });
        }
    }
    parseDir(dirName: string) {
        utils.outputChannel.clear();
        // 获取所有文件，然后出个排查
        return readfiles(dirName, {
            filter: [
                '*.ts',
                '*.tsx',
                '*.js',
                '*.jsx',
            ]
        }, (err: any, filename: any) => {
            if (err) throw err;
        }).then(async (files: any) => {
            var index = 0;
            var run = () => {
                const filename = path.join(dirName, files[index]);
                this.parseFile(filename, {
                    isPutColor: false,
                    isShowLog: true
                }).then(() => {
                    index++;
                    if (index < files.length) {
                        run();
                    }
                });
            }
            run();
        })
    }
    parseFile(filepath: string, {
        isPutColor = false,
        isShowLog = true
    }: ParseFileParam) {
        if (!this.caches[filepath]) {
            this.caches[filepath] = new Parser(filepath);
        }
        return this.caches[filepath].parse({isPutColor, isShowLog});
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