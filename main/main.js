//======== Setup ============
const fs = require('fs');
const schema = fs.readFileSync('main/schemaLarge.gql', "utf8");
const convert = require('../index');

//======== GraphQL to JavaScript using tool ===========
const cycles = convert(schema);

//console.log(cycles);
