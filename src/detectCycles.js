/*
 * Input to this file should be a selector for choosing a cycle or all
 * Check when removing a node if the references are automaticaly removed
 */

module.exports = function (Graph /*, select*/) {

    function pruneEdge(SCC) {

	for(var component in SCC) {
	    var lowlink = SCC[component][0].lowlink;
	    for(var vertex in SCC[component]) {
		for (ref = 0; ref < SCC[component][vertex].referenceList.length; ref++) {
		    if ( SCC[component][vertex].referenceList[ref].reference.lowlink !== lowlink ) {
			SCC[component][vertex].referenceList.splice(ref,1);
			ref -= 1; //after removing the list will be one element shorter
		    }
		}
	    }
	}
	//return SCC;
    }

    // Tarjan's algorith START
    var foundCycle = false;
    var SCCs = [];
    var allCycles = [];

    function tarjan(input) {
	var stack  = [];
	var index = 0;
	for( var vertex in Graph ) {
	    if ( foundCycle ) return true;
	    else if ( typeof Graph[vertex].visited === "undefined" ) strongConnect(Graph[vertex]);
	}
	function strongConnect(vertex) {
	    vertex.index = index;
	    vertex.lowlink = index;
	    index += 1;
	    stack.push(vertex);
	    vertex.visited = true;
	    vertex.onStack = true;
	    // Successors of vertex
	    for(var reference in vertex.referenceList) {
		if ( typeof vertex.referenceList[reference].reference.visited === "undefined" ) {
		    strongConnect(vertex.referenceList[reference].reference);
		    vertex.lowlink = Math.min(vertex.lowlink,
					      vertex.referenceList[reference].reference.lowlink);
		}
		else if ( vertex.referenceList[reference].reference.onStack ) {
		    vertex.lowlink = Math.min(vertex.lowlink,
					      vertex.referenceList[reference].reference.index);
		    if (input) {
			foundCycle = true;
			return;
		    }
		}
	    }
	    // If vertex is a root node, then a SCC is found => pop
	    if (vertex.lowlink === vertex.index) {
		var tmpSCC = [];
		do {
		    w = stack.pop();
	            w.onStack = false;
		    w.index = tmpSCC.length; // will be used in johnsons
		    tmpSCC.push(w);
		} while (w !== vertex);
		SCCs.push(tmpSCC);
	    }
	    return;
	}
	//SCCs = pruneEdge(SCCs);
	return;
    }
    // Tarjan's algorithm END

    // Johnson's algorithm START
    function johnson(component) {
	var Blocked = Array(component.length).fill(false); //blocked
	var BlockedMap = Array(component.length).fill([]);   //B
	var stack = [];
	var foundCycle = false;
	var startvertex = 0;

	for (var vertex = 0; vertex < component.length; vertex++) {
	    startvertex = vertex;
	    findCycles(vertex);
	}

	function unblock ( u ) {
	    console.log("uniblockie");
	    Blocked[u] = false;
	    for (var w in BlockedMap[u]) {
		//delete w from BlockedMap
		BlockedMap.splice(w,1);
		if (Blocked[w]) unblock(w);
	    }
	}
	function findCycles (v) {
	    //foundCycle = false;
	    var result = [];
	    stack.push(v); // push indedx of vertex (in component)
	    Blocked[v] = true;

	    for (var edge in component[v].referenceList) {
		edgeRef = component[v].referenceList[edge];

		if (edgeRef.reference.index === startvertex) {
		    foundCycle = true;
		    console.log("--------------> a cycle was found!");
		    // loop trough the stack and save it.
		    for(var item in stack) {
			console.log(stack);
			result.push(component[stack[item]]);
		    }
		    allCycles.push(result);
		    result = [];
		}
		else if (!Blocked[edgeRef.reference.index] && startvertex < edgeRef.reference.index) {
		    console.log("htee");
		    foundCycle = findCycles(edgeRef.reference.index);
		}
	    }
	    if (foundCycle) unblock(v);
	    else {
		for (var w in component) {
		    if ( !BlockedMap[w].includes(v)) {
			BlockedMap[w].push(v);
		    }
		}
	    }
	    console.log("how many levels of recursion are you on?!");
	    stack.pop(v);
	    return foundCycle;
	} // findCycles end
    }

    // Johnson's algorithm END
    ifCycle = tarjan();

    if (ifCycle) console.log("A cycle ");

    pruneEdge(SCCs);

    for( var i in SCCs ) {
	console.log("New SCC");
	for (var v in SCCs[i]) {
	    console.log(SCCs[i][v].vertexID + " with index " + SCCs[i][v].index +
			" - Have the following references:");
	    for(var ref in SCCs[i][v].referenceList){
		console.log("---> " + SCCs[i][v].referenceList[ref].reference.vertexID);
	    }
	}
    }
    for (var i in SCCs) {
	johnson(SCCs[i]);
    }
    console.log("CYCLES COMMING RIGHT UP FAMALAM : ");
    console.log(allCycles);
    return allCycles;

}
