//======== Setup ============
const fs = require('fs');

// take input on what file shuold be run.
const filename = process.argv[2];

const schema = fs.readFileSync(filename, "utf8");
const run = require('../index');

//======== GraphQL to JavaScript using tool ===========
const res = run(schema);

// data.cycles // contains cycles.
// data.foundCycle // contains true false.

for( var sc in res.cycles) {
  var string = "{ ";
  for ( var vert in res.cycles[sc] ) {
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

//console.log(cycles);
