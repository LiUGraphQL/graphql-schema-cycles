//======== Setup ============
const { PerformanceObserver, performance } = require('perf_hooks');
const fs = require('fs');

// take input on what file shuold be run.
const filename = process.argv[2];
const flag_or_cfile = process.argv[3];
const outputfile = process.argv[4];


                 // else save to filename.

const schema = fs.readFileSync(filename, "utf8");
const run = require('../index');

const debug = false; // set to false

//======== GraphQL to JavaScript using tool ===========
var t1 = performance.now();
const res = run(schema, flag_or_cfile);
var t2 = performance.now();
// should save and print here:

var nrCycles = res.numberCycles;

var SCCs = res.SCCs;
var longestSCC = res.longestSCC;

var avrageLengthOfCycle = 0;

if(nrCycles > 0)
{
  for(var sc in res.cycles)
  {
    avrageLengthOfCycle += res.cycles[sc].length;
  }
  avrageLengthOfCycle = avrageLengthOfCycle / nrCycles;
}

if(outputfile === undefined)
{
  if(!debug)
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
  else // if debug!
  {
    console.log("TOTAL TIME: " + t2-t1); // time in milliseconds // should be for all types.
    console.log("Time Parse: " + res.metadata.timeParse);
    console.log("Time Graph " + res.metadata.timeGraph);
    console.log("Time Cycle " + res.metadata.timeCycle);
    console.log("#SCCs " + SCCs);
    console.log("Longest SCC " + longestSCC);
    console.log("#Vertices " + res.metadata.nrVertex);
    console.log("#Types " + res.metadata.nrType);
    console.log("#unions " + res.metadata.nrUnion);
    console.log("#interfaces " + res.metadata.nrInterface);
    console.log("#edges " + res.metadata.nrEdges);
    console.log("edges/vertex " + edgesToVertexRatio);
    console.log("Avrage cycle length: " + avrageLengthOfCycle);
    console.log("#Cycles " + nrCycles);
  }
}
else // if outputfile
{
  var edgesToVertexRatio = 0;
  if(res.metadata.nrVertex > 0)
  {
    edgesToVertexRatio = res.metadata.nrEdges / res.metadata.nrVertex;
  }

  var cvsData = "";
  cvsData += t2-t1 + ","; // time in milliseconds // should be for all types.

  cvsData += res.metadata.timeParse + ",";
  cvsData += res.metadata.timeGraph + ",";
  cvsData += res.metadata.timeCycle + ",";

  cvsData += SCCs + ",";
  cvsData += longestSCC + ",";

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
