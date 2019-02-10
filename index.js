const { PerformanceObserver, performance } = require('perf_hooks');
const converter = require('./graphql-to-json-converter/lib/converter');
const convertToGraph = require('./src/graphify');
const detectCycles = require('./src/detectCycles');

module.exports = function convert(data, flag_or_cfile) {

    var t1 = 0;
    var t2 = 0;

    var metadata = {"nrType":0, "nrInterface": 0, "nrUnion": 0};

    t1 = performance.now();
    const jsObj = converter(data);
    t2 = performance.now();
    metadata.timeParse = t2-t1;

    t1 = performance.now();
    const graph = convertToGraph(jsObj);
    t2 = performance.now();
    metadata.timeGraph = t2-t1;

    metadata.nrEdges = graph.edges;
    metadata.nrVertex = graph.vertices;
    metadata.nrType = graph.nrType;
    metadata.nrInterface = graph.nrInterface;
    metadata.nrUnion = graph.nrUnion;

    t1 = performance.now();

    var allCycles = detectCycles(graph.graph, false, flag_or_cfile);


    t2 = performance.now();
    metadata.timeCycle = t2-t1;

    allCycles.metadata = metadata;
    return allCycles;
}
