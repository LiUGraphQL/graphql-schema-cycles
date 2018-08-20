const converter = require('./graphql-to-json-converter/lib/converter');
const convertToGraph = require('./src/graphify');

/*
  

*/
module.exports = function convert(data) {
    const jsObj = converter(data);
    return convertToGraph(jsObj);
}
