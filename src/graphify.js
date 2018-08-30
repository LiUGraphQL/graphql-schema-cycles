/*
  * Union or union, it will crash on Union
*/
module.exports = function (data) {

    var Graph = [];
    const graphQLTypes = ["Int", "String", "ID", "Boolean", "Float"];
    const excludeList = ["Mutation","Query", "Subscription"];
    var unionFound = false;

    function addToGraph(target)
    {
	for ( var objectName in data[target] )
	{
	    if ( !excludeList.includes(objectName) )
	    {
		var objectType = data[target][objectName];
		if ( objectType["implements"] !== undefined)
		{
		    objectType = objectType["implements"][Object.keys(objectType["implements"])[0]];
		}
		var tmpReferenceList = [];
		for ( var fields in objectType)
		{
		    unionFound = false;
		    if ( !(graphQLTypes.includes(objectType[fields].type)) )
		    {
			for ( var unions in data.union )
			{
			    if ( unions === objectType[fields].type)
			    {
				unionFound = true;
				for ( var unionField in data.union[unions] )
				{
				    tmpReferenceList.push({"label": fields, "reference": unionField});
				}
			    }
			}
			if ( !unionFound ) {
			    tmpReferenceList.push({"label": fields ,"reference": objectType[fields].type});
			}
		    }
		}
 		var tmpVertex = {"vertexID": objectName};
		tmpVertex.vertexType = target;
		tmpVertex.referenceList = tmpReferenceList;
		Graph.push(tmpVertex);
	    }
	}
    }

    function connectVertices()
    {
	for ( var vertex in Graph)
	{
	    for ( var ref in Graph[vertex].referenceList)
	    {
		var reference = Graph[vertex].referenceList[ref].reference;
		for ( var target in Graph)
		{
		    if ( Graph[target].vertexID === reference )
		    {
			Graph[vertex].referenceList[ref].reference = Graph[target];
			break;
		    }
		}
	    }
	}
    }

    function printGraph()
    {
	for ( var vertex in Graph )
	{
	    console.log("Refering from: " + Graph[vertex].vertexID);
	    for ( var reference in Graph[vertex].referenceList )
	    {
		console.log("  TO: " + Graph[vertex].referenceList[reference].reference.vertexID);
	    }
	}
    }

    addToGraph("type");
    addToGraph("interface");
    connectVertices();
    //printGraph();
    return Graph;
}
