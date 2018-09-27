function convertToGraph(data) {

    var Graph = [];
    const graphQLTypes = ["Int", "String", "ID", "Boolean", "Float"];
    const excludeList = ["Mutation","Query", "Subscription"];
    //var unionFound = false;

    function addToGraph(target) {
	for ( var objectName in data[target] ) {
	    var derived_by = "";
	    var is_derived = false;

	    if ( !excludeList.includes(objectName) ) {
		var objectType = data[target][objectName];

		if ( objectType["implements"] !== undefined) {
		    is_derived = true;
		    derived_by = Object.keys(objectType["implements"])[0];
		    objectType = objectType["implements"][Object.keys(objectType["implements"])[0]];
		}

		var tmpReferenceList = [];
		for ( var fields in objectType) {
		    //unionFound = false;
		    if ( !(graphQLTypes.includes(objectType[fields].type)) ) { // if not a standard type
			/*for ( var unions in data.union ) {  // check if reference is a union.
			    if ( unions === objectType[fields].type) {
				unionFound = true;
				for ( var unionField in data.union[unions] ) {
				    tmpReferenceList.push({"label": fields, "reference": unionField});
				}
			    }
			}*/
			//if ( !unionFound ) {
			if (target === "union") { // since unions are added withouth references.
			    tmpReferenceList.push({"label":"#union_ref", "reference":fields});
			}
			else {
			    tmpReferenceList.push({"label": fields ,"reference": objectType[fields].type});
			}
			//}
		    }
		}
 		var tmpVertex = {"vertexID": objectName};
		tmpVertex.vertexType = target;
		tmpVertex.referenceList = tmpReferenceList;
		Graph[objectName] = tmpVertex;

		if(is_derived) {
		    Graph[derived_by].referenceList.push({"label":"#interface_ref", "reference":objectName});
		}
	    }
	}
    }

    function connectVertices() {
	for ( var vertex in Graph) {
	    for ( var ref in Graph[vertex].referenceList) {
		var reference = Graph[vertex].referenceList[ref].reference;
		for ( var target in Graph) {
		    if ( Graph[target].vertexID === reference ) {
			Graph[vertex].referenceList[ref].reference = Graph[target];
			break; // exit the last loop
		    }
		}
	    }
	}
    }

    function printGraph() {
	for ( var vertex in Graph ) {
	    console.log("Refering from: " + Graph[vertex].vertexID);
	    for ( var reference in Graph[vertex].referenceList ) {
		console.log("  TO: " + Graph[vertex].referenceList[reference].reference.vertexID);
	    }
	}
    }
    addToGraph("interface");
    addToGraph("union");
    addToGraph("type");

    connectVertices();
    return Graph;
}
