function detectCycles(Graph, select) {

  function pruneEdge(SCC) {
    for(var component in SCC) {
      for(var vertex in SCC[component]) {
        for (ref = 0; ref < SCC[component][vertex].referenceList.length; ref++) {
          // if current reference is pointing to a lowlink that is not ours prune it!.
          if ( SCC[component][vertex].referenceList[ref].reference.lowlink !==
            SCC[component][vertex].lowlink ) {
              SCC[component][vertex].referenceList.splice(ref,1);
              ref -= 1; //after removing the list will be one element shorter
            }
          }
        }
      }
    }

    // Tarjan's algorith START
    var foundCycle = false;
    var SCCs = [];
    var allCycles = [];
    var allEdges = [];

    function tarjan(input) {
      var stack  = [];
      var index = 0;
      for( var vertex in Graph ) {
        if ( foundCycle ) return true;
        else if ( Graph[vertex].visited !== true ) strongConnect(Graph[vertex]);
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
          if ( vertex.referenceList[reference].reference.visited !== true ) {
            strongConnect(vertex.referenceList[reference].reference);
            vertex.lowlink = Math.min(vertex.lowlink,
              vertex.referenceList[reference].reference.lowlink);
            }
            else if ( vertex.referenceList[reference].reference.onStack ) {

              vertex.lowlink = Math.min(vertex.lowlink,
                vertex.referenceList[reference].reference.index);
                if (input) {
                  foundCycle = true;
                  //return true;
                  return;
                }
              }
            }
            if (vertex.lowlink === vertex.index) {
              var tmpSCC = [];
              do {
                w = stack.pop();
                w.lowlink = vertex.index; // To make sure.
                w.onStack = false;
                w.jIndex = tmpSCC.length; // will be used in johnsons
                tmpSCC.push(w);
              } while (w !== vertex);
              SCCs.push(tmpSCC);
            }
          }
        }
        // Tarjan's algorithm END

        // Johnson's algorithm START
        function johnson(component) {

          var Blocked = Array(component.length).fill(false); //blocked
          var BlockedMap = Array(component.length).fill([]);   //B
          var stack = [];
          var stackEdges = [];
          var foundCycle = false;
          var startvertex = 0;

          for (var vertex = 0; vertex < component.length; vertex++) {
            startvertex = vertex;
            findCycles(vertex);
	          BlockedMap = Array(component.length).fill([]);
            Blocked = Array(component.length).fill(false);
          }

          function unblock ( u ) {
            Blocked[u] = false;           // unblock current node u
            for (var w in BlockedMap[u]) { // for every node that u blocks
              var targetBlock = BlockedMap[u][w]; // unblock that vertex aswell.
              if (Blocked[targetBlock]) unblock(targetBlock);
            }
            BlockedMap[u] = []; // empty blocked map!
          }


          function findCycles (v) {

            if(allCycles.length > 1000)
            {
              throw "More than 1000 cycles found";
            }

            var result = [];
            var resultEdges = [];
            stack.push(v); // push indedx of vertex (in component)
            Blocked[v] = true;

            for (var edge in component[v].referenceList) {
              edgeRef = component[v].referenceList[edge];
              if (edgeRef.reference.jIndex === startvertex) {
                foundCycle = true;
                stackEdges.push(edgeRef.label);
                for(var item in stack) {
                  result.push({"vertex":component[stack[item]],"refLabel":stackEdges[item]});
                }
                result.push({"vertex":component[startvertex],"refLabel":""});
                stackEdges.pop();
                //console.log("CYCLE FOUND " + allCycles.length + " -> and startvertex is: " + startvertex);
                allCycles.push(result);
                result = [];
                resultEdges = [];
              }
              else if (!Blocked[edgeRef.reference.jIndex] && startvertex < edgeRef.reference.jIndex && edgeRef.reference.jIndex != v) { // added last
                stackEdges.push(edgeRef.label);
                var foundCycle = findCycles(edgeRef.reference.jIndex);
              }
            }
            if (foundCycle) unblock(v);
            else {
              for (var wt in component[v].referenceList) { //w in component
                w = component[v].referenceList[wt].reference.jIndex
                if ( !BlockedMap[w].includes(v)) {
                  BlockedMap[w].push(v);
                }
              }
            }
            stack.pop();
            stackEdges.pop();
            return foundCycle;
          } // findCycles end
        }
        // Johnson's algorithm END
        var returndata = {};
        returndata.foundCycle = false;
        returndata.cycles = [];

        tarjan(select);

        if(select) {
          returndata.foundCycle = foundCycle;
          return returndata; // ifcycle
        }

        pruneEdge(SCCs);

        for (var i in SCCs) {

          try {
            johnson(SCCs[i]);

          } catch (e) {
            console.log(e);
            returndata.cycles = allCycles;
            returndata.foundCycle = (allCycles.length > 0);
            return returndata;
          }

        }

        returndata.foundCycle = (allCycles.length > 0);
        returndata.cycles = allCycles;
        return returndata;
      }
