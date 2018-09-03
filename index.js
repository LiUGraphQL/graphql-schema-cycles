const converter = require('./graphql-to-json-converter/lib/converter');
const convertToGraph = require('./src/graphify');
const detectCycles = require('./src/detectCycles');

module.exports = function convert(data) {
    const jsObj = converter(data);
    const graph = convertToGraph(jsObj);
    //const allCycles = detectCycles(graph);
    const allCycles = detectCycles(graph);
    return allCycles;
}
