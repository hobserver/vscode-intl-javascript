
export default (moduleName: string) => {
    const filePath = require.resolve(moduleName);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
    return require(moduleName);
}