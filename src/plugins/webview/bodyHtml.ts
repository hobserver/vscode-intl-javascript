import Parser from "../../model/Parser";
import initBodyFooterJs from './bodyFooterJs';
import initBodyHeaderJs from './bodyHeaderJs';
export default function initBodyJs(parser: Parser) {
    const {webViewHooks} = parser;
    initBodyHeaderJs(parser);
    initBodyFooterJs(parser);
    webViewHooks.bodyHtmlHook.tapPromise('body', async (bodyArr: [string]) => {
        const headerJs = await webViewHooks.bodyHeaderJsHook.promise([]);
        const footerJs = await webViewHooks.bodyFooterJsHook.promise([]);
        return headerJs.concat(bodyArr).concat([
            `
            <div id="app">
                <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="key">
                    <el-input placeholder="请输入内容" v-model="form.intlKey" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item v-for="item in form.langs" :key="item.langKey" :label="item.langKey">
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="item.value"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button v-for="item in btns" :key="item.key" type="primary" @click="onSubmit(item)">{{item.text}}</el-button>
                </el-form-item>
                </el-form>
            </div>    
            `
        ]).concat(footerJs);
    });
}