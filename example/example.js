//======== Setup ============
const fs = require('fs');
const schema = fs.readFileSync('example/schema.gql', "utf8");
const convert = require('../index');


//======== GraphQL to JavaScript using tool ===========
const jsSchema = convert(schema);

//======== JavaScript to JSON and output to file ==========
/*fs.writeFile('example/generated-schema.json',
    JSON.stringify(jsSchema, null, 2) + '\n',
    'utf8',
    function (err) {
      if (err) console.log(err);
});*/
