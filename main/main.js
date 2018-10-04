//======== Setup ============
const { PerformanceObserver, performance } = require('perf_hooks');
const fs = require('fs');

/*

var fs = require('fs');


*/



// take input on what file shuold be run.
const filename = process.argv[2];

const schema = fs.readFileSync(filename, "utf8");
const run = require('../index');

//======== GraphQL to JavaScript using tool ===========
var t1 = performance.now();
const res = run(schema);
var t2 = performance.now();
// should save and print here:

var nrCycles = res.cycles.length;
var avrageLengthOfCycle = 0;

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
    //string += ", ";
  }
  string = string.slice(0,-7);
  string += " }";
  console.log(string);
}

avrageLengthOfCycle /= nrCycles;

console.log("Time taken: " + (t2-t1) + " millisecounds.");
console.log("Space taken: " + "test");
console.log("Graph metadata...");
console.log("Number of vertices: " + res.noVertex);
console.log("Number of edges: " + res.noEdges);
console.log("Connections / vertex: " + (res.noEdges/res.noVertex));
console.log("Cycles in graph...");
console.log("Number of cycles: " + nrCycles);
console.log("Avrage length of cycles: "+ avrageLengthOfCycle);

// write to file now...

var cvsData = "";
cvsData += (t2-t1) + ",";
cvsData += 0 + ",";
cvsData += res.noVertex + ",";
cvsData += res.noEdges + ",";
cvsData += res.noEdges/res.noVertex + ",";
cvsData += nrCycles + ",";
cvsData += avrageLengthOfCycle + "\n";


fs.appendFileSync('CVS.txt', cvsData);


//console.log(cycles);
