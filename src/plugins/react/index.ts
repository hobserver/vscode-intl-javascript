import Parser from '../../model/Parser';
export = class {
    options
    constructor(options: any) {
        this.options = options;
    }
    apply({babelHooks}: Parser) {
        babelHooks.babelPresetHook.tap('preset', ((presets: any[]) => {
            return presets.concat([
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript')
            ]);
        }));
        babelHooks.babelPluginHook.tap('plugin', ((plugins: any[]) => {
            return plugins.concat([
                [
                    require.resolve("@babel/plugin-proposal-decorators"),
                    {
                        legacy: true
                    }
                ],
                require.resolve("@babel/plugin-proposal-class-properties")
            ]);
        }));
    }
}