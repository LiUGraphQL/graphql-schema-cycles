const converter = require('./graphql-to-json-converter/lib/converter');
const convertToGraph = require('./src/graphify');
const detectCycles = require('./src/detectCycles');

module.exports = function convert(data) {
    const jsObj = converter(data);

    const graph = convertToGraph(jsObj);
    //const allCycles = detectCycles(graph);

    var edges = graph.edges;
    var vertices = graph.vertices;
    console.log(edges + " " + vertices);


    var allCycles = detectCycles(graph.graph);

    allCycles.noEdges = edges;
    allCycles.noVertex = vertices;
    // data.noVertex // Number of vertices.
    // data.noEdges // Number of edges.

    return allCycles;
}
