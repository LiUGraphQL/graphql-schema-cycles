function convertToGraph(data) {

  var Graph = [];
  var vertices = 0;
  var edges = 0;

  var total_vertices = 0;

  const graphQLTypes = ["Int", "String", "ID", "Boolean", "Float"];
  const excludeList = ["Mutation","Query", "Subscription"];

  function addToGraph(target) {
    for ( var objectName in data[target] ) {

      var derived_by = [];
      var is_derived = false;
      vertices++;

      if ( !excludeList.includes(objectName) ) {
        var objectType = data[target][objectName];

        if ( objectType["implements"] !== undefined) {
          is_derived = true;

          derived_by.push(Object.keys(objectType["implements"])[0]);
          objectType = objectType["implements"][Object.keys(objectType["implements"])[0]];

          while ( objectType["&"] !== undefined)
          {
            derived_by.push(Object.keys(objectType["&"])[0]);
            objectType = objectType["&"][Object.keys(objectType["&"])[0]];
          }
        }

        var tmpReferenceList = [];
        for ( var fields in objectType) {

          if(objectType[fields]["type"] === undefined && objectType[fields]["args"] !== undefined)
          {
            objectType[fields]["type"] = objectType[fields]["args"]["type"];
          }

          if ( !(graphQLTypes.includes(objectType[fields].type)) ) { // if not a standard type
            if (target === "union") {
              tmpReferenceList.push({"label":"#union_ref", "reference":fields});
            }
            else {
              tmpReferenceList.push({"label": fields ,"reference": objectType[fields].type});
            }
          }
        }
        var tmpVertex = {"vertexID": objectName};
        tmpVertex.vertexType = target;
        tmpVertex.referenceList = tmpReferenceList;
        Graph[objectName] = tmpVertex;

        if(is_derived) {

          for(var der in derived_by)
          {
            Graph[derived_by[der]].referenceList.push({"label":"#interface_ref", "reference":objectName});
          }
        }
      }
    }
  }

  function connectVertices() {
    for ( var vertex in Graph) {
      for ( var ref in Graph[vertex].referenceList) {
        var reference = Graph[vertex].referenceList[ref].reference;
        edges++;
        if(Graph[reference] === undefined)
        {
          console.log(Graph[vertex].referenceList[ref].label);
          console.log(Graph[vertex].referenceList[ref].reference);
          throw new Error("Field - reference not defined");
        }
        Graph[vertex].referenceList[ref].reference = Graph[reference];
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

  for(var _enum in data["enum"])
  {
    graphQLTypes.push(_enum);
  }
  for(var _scalar in data["scalar"])
  {
    graphQLTypes.push(_scalar);
  }
  var returndata = {};


  addToGraph("interface");
  returndata.nrInterface = vertices;
  total_vertices = vertices;

  addToGraph("union");
  returndata.nrUnion = vertices - total_vertices;
  total_vertices += vertices;

  addToGraph("type");
  returndata.nrType = vertices - total_vertices;
  total_vertices += vertices;


  if(Graph["Subscription"] === undefined) {
    Graph["Subscription"] = {"vertexID": "Subscription", "referenceList":[]};
  }
  if(Graph["Mutation"] === undefined) {
    Graph["Mutation"] = {"vertexID": "Mutation", "referenceList":[]};
  }
  if(Graph["Query"] === undefined) {
    Graph["Query"] = {"vertexID": "Query", "referenceList":[]};
  }

  connectVertices();

  returndata.graph = Graph;
  returndata.edges = edges;
  returndata.vertices = vertices;

  return returndata;
}
