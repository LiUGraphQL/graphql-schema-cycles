/*
 * Set Cycle to true when the first cycle is found, depending on a input variable -> return immediately.
 * w !== vertex Does it find the right w, eg. the right version of 'User'
 * Does it skip vertecies !!?!? based on visited?
 */

module.exports = function (Graph) {

    var Cycles = [];
    var Cycle = false;
    var stronglyConnectedComponents = [];

    // Tarjan's algorith START
    function tarjan() {
	var stack  = [];
	var index = 0;
	for( var vertex in Graph ) {
	    if ( typeof Graph[vertex].visited === "undefined" ) strongConnect(Graph[vertex]);
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
		}
	    }
	    // If vertex is a root node, then a SCC is found => pop
	    if (vertex.lowlink === vertex.index) {
		var tmpSCC = [];
		do {
		    w = stack.pop();
	            w.onStack = false;
		    tmpSCC.push(w);
		} while (w !== vertex);
		stronglyConnectedComponents.push(tmpSCC);
	    }
	    return;
	}
	return;
    }


    // Tarjan's algorithm END

    // Johnson's algorithm START

    function johnson()
    {

	return Graph;

    }
    tarjan();
    console.log("Found: " + stronglyConnectedComponents.length + " strongly connected components of lenght: ");
    for( var i in stronglyConnectedComponents ) {
	console.log(stronglyConnectedComponents[i].length);
    }
    return johnson();
    // Johnson's algorithm END
    //    return Cycles;
}
