//======== Setup ============
const fs = require('fs');

// take input on what file shuold be run.
const filename = process.argv[2];

const schema = fs.readFileSync(filename, "utf8");
const convert = require('../index');

//======== GraphQL to JavaScript using tool ===========
const cycles = convert(schema);

//console.log(cycles);
