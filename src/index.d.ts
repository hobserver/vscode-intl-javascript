export * from '../src/interface';
import {LangKey, ParserService,
    WebviewListenerParams,
    MessageInfoSendParams,
    MessageInfoResParams,
    GlobalCommandParam,
} from './interface';
declare module 'intl-vscode-javascript' {
    export {
        LangKey,
        ParserService,
        WebviewListenerParams,
        MessageInfoSendParams,
        MessageInfoResParams,
        GlobalCommandParam
    }
}