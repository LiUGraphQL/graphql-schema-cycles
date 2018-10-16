//======== Setup ============
const { PerformanceObserver, performance } = require('perf_hooks');
const fs = require('fs');

// take input on what file shuold be run.
const filename = process.argv[2];
const outputfile = process.argv[3];

const schema = fs.readFileSync(filename, "utf8");
const run = require('../index');


//======== GraphQL to JavaScript using tool ===========
var t1 = performance.now();
const res = run(schema);
var t2 = performance.now();
// should save and print here:

var nrCycles = res.cycles.length;
var avrageLengthOfCycle = 0;

if(outputfile === undefined)
{
    for( var sc in res.cycles) {
	var string = "{ ";

	for ( var vert in res.cycles[sc] ) {

	    avrageLengthOfCycle++;
	    string += res.cycles[sc][vert]["vertex"].vertexID;
	    if( res.cycles[sc][vert]["refLabel"] === "#interface_ref") {
		string += " <~implements~ ";
	    }
	    else if (res.cycles[sc][vert]["refLabel"] === "#union_ref") {
		string += " -union-> ";
	    }
	    else string += " -[" + res.cycles[sc][vert]["refLabel"] + "]-> ";
	}
	string = string.slice(0,-7);
	string += " }";
	console.log(string);
    }
}
else
{

    
    if(nrCycles > 0)
    {
	for(var sc in res.cycles)
	{
	    avrageLengthOfCycle += res.cycles[sc].length;
	}
	avrageLengthOfCycle = avrageLengthOfCycle / nrCycles;
    }
    else
    {
	avrageLengthOfCycle = 0;
    }
    
    // console.log(nrCycles + " " + avrageLengthOfCycle);

    // write to file now...
    var edgesToVertexRatio = 0;
    if(res.metadata.noVertex > 0) edgesToVertexRatio = res.metadata.noEdges / res.metadata.noVertex;

    var cvsData = "";
    cvsData += t2-t1 + ","; // time in milliseconds // should be for all types.

    cvsData += res.metadata.timeParse + ",";
    cvsData += res.metadata.timeGraph + ",";
    cvsData += res.metadata.timeCycle + ",";

    cvsData += 0 + ","; // empty could be space bound.
    cvsData += res.metadata.nrVertex + ","; // number of vertices.

    cvsData += res.metadata.nrType + ",";
    cvsData += res.metadata.nrUnion + ",";
    cvsData += res.metadata.nrInterface + ",";

    cvsData += res.metadata.nrEdges + ","; // number of edges.
    cvsData += edgesToVertexRatio + ","; // edges to vertices ratio
    cvsData += nrCycles + ","; // nr of cycles
    cvsData += avrageLengthOfCycle + "\n"; // avrage length of cycle.

    fs.appendFileSync(outputfile, cvsData);
}
//console.log(cycles);
