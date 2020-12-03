import { WebviewListenerParams } from "../../interface";
import Parser from "../../model/Parser";
import initBodyCreateJs from "./createdHook";
export default function initBodyJs(parser: Parser) {
    const {webViewHooks, webview} = parser;
    initBodyCreateJs(parser);
    webViewHooks.vueHooks.methodsHook.tapPromise('methods', async (methods: WebviewListenerParams[]) => {
        return methods.concat([
            {
                name: 'onSubmit',
                functionConstructorParams: [
                    'item',
                    `
                    if (this.form.key
                        && this.form.langs[0].value
                        && this.form.key != ''
                        && this.form.langs[0].value != ''
                        && this.form.key != 'undefined'
                        && this.form.langs[0].value != 'undefined'
                    ) {
                        htmlBtnCallbacks[item.key](this.form)
                    } else {
                        triggerParentListener('showInformationMessage', 'key and first lang value can not be null');
                    }
                    `
                ]
            }
        ]);
    });
    webViewHooks.bodyFooterJsHook.tapPromise('footerJs', async (jsArr: string[]) => {
        const createds = await webViewHooks.vueHooks.createdHook.promise([]);
        const methods = await webViewHooks.vueHooks.methodsHook.promise([]);
        return jsArr.concat([
            `
            <script type="text/javascript">
                // 处理createed
                const createdInits = ${JSON.stringify(createds, null, 4)}.map(functionConstructorParams => {
                    return new Function(...functionConstructorParams);
                });
                // 处理 methods
                var methodObjs = {};
                ${JSON.stringify(methods, null, 4)}.forEach(method => {
                    methodObjs[method.name] = new Function(...method.functionConstructorParams);
                });
            </script>
            `,
            `
            <script type="text/javascript">
            window.app = new Vue({
                el: '#app',
                data() {
                    return {
                        form: {
                            key: '',
                            langs: [],
                        },
                        btns: htmlBtns
                    }
                },
                computed: {
                },
                created() {
                    createdInits.forEach((initFunction) => {
                        initFunction(this);
                    });
                },
                methods: methodObjs
            });
            </script>
            `
        ]);
    });
}