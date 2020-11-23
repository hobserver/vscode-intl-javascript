import Parser from "../../model/Parser";
export default function initBodyJs(parser: Parser) {
    const {webViewHooks} = parser;
    webViewHooks.bodyHeaderJsHook.tapPromise('btns', async (headerJsArr: string[]) => {
        const btns = await webViewHooks.btnHook.promise([]);
        return headerJsArr.concat([
            `
<script>
(function() {
    // 处理btns
    window.htmlBtns = ${JSON.stringify(btns, null, 4)};
    window.htmlBtnCallbacks = {};
    htmlBtns.forEach((item) => {
        window.htmlBtnCallbacks[item.key] = new Function(...item.functionConstructorParams);
    });
    console.log(window.htmlBtnCallbacks);
})();
</script>
            `
        ]);
    });
}