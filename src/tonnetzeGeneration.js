let graph = new TonnetzeGraph(d3.select(".container"));

//---------------------------------------------------------------
// Initialize tonnetze
//---------------------------------------------------------------
let names = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
for(let i = 0; i < 12; i++) 
{
  graph.addNode({id:i, name:names[i], edges:[],  type:"note"});
}

let edges = [];
for(let node = 0; node < 12; ++node) 
{  
  [{interval:7, direction:"+x"},
   {interval:4, direction:"+y"},
   {interval:9, direction:"+z"},
   {interval:5, direction:"-x"},
   {interval:8, direction:"-y"},
   {interval:3, direction:"-z"}
  ].forEach( nodeLayout => 
  {
    edges.push({source: node, target: (node + nodeLayout.interval) % 12, direction: nodeLayout.direction});
  });      
}

function dirIndex(direction) 
{
  switch(direction) 
  {
    case "+x" : return 0;
    case "+y" : return 1;
    case "+z" : return 2;
    case "-x" : return 3;
    case "-y" : return 4;
    case "-z" : return 5;
    default : -1;
  }
}
  
edges.forEach(edge => graph.addLink(edge));


//---------------------------------------------------------------
// Generate chords graph
//---------------------------------------------------------------
let chordNodes = [];
for(let originNode = 0; originNode < 12; ++originNode)
{
  // For all edges, find all common edge node with origin
  let neighborNodes = graph
  .nodes[originNode]
  .edges
  .filter(edge => edge.target < 12)
  .map(edge => edge.target); 
  
  neighborNodes.forEach(neighborNode => 
  {
    // Find neighbors of neighbors
    let distantNodes = graph
    .nodes[neighborNode]
    .edges
    .filter(edge => edge.target < 12)
    .map(edge => edge.target);

    // Match common neighbors with origin node
    let commonNeighbors = [];
    distantNodes.forEach( distantNode => 
    {
      neighborNodes.forEach( neighborNode => 
      {
        if(neighborNode === distantNode) 
        {
          commonNeighbors.push(neighborNode);
        }
      })
    });
    
    commonNeighbors.forEach(commonNeighbor => 
    {
      // Skip augmented chord
      if(!chordIsAugmented(originNode, neighborNode, commonNeighbor)) 
      {
        let currentChord = [names[originNode], names[neighborNode], names[commonNeighbor]].sort().join("");
        
        // Find chord in graph or add it
        let chordId;
        if(chordNodes.length === 0 
           || !chordNodes.map(node => node.name).some(name => name === currentChord)) 
        {          
          // Set new chord id
          chordId = 12 + chordNodes.length;
          
          // Identify root of chord
          let root;
          let notesOfChord = [originNode, neighborNode,commonNeighbor];
          notesOfChord.forEach(note => 
          {             
            let noteInDirectionX = graph.nodes[note].edges[dirIndex("+x")].target;   
            if(notesOfChord.some(_note => _note === noteInDirectionX)) { root = note; }                        
          });
                    
          // Identify chord voicing
          let voicing = "";
          // Get root node
          let rootMajorThird = graph.nodes[root].edges[dirIndex("+y")].target;
          voicing = notesOfChord.some(note => note === rootMajorThird) ? "major" : "minor";
          
          // Create chord and add it to graph          
          let chordEdges = [];
          notesOfChord.forEach(note => 
          {
            chordEdges.push({source:chordId, target: note});
          });
          
          let newChord = {
            id: chordId, 
            name: currentChord, 
            edges: [], 
            radius: 20, 
            type: "chord", 
            root: root, 
            voicing: voicing};
          
          graph.addNode(newChord);
          chordEdges.forEach(edge => 
          { 
            graph.addLink(edge);
          });             
          chordNodes.push(graph.nodes[chordId]);
        }
        else 
        {
          let indexOfChord = chordNodes.map(node => node.name).indexOf(currentChord);
          chordId = chordNodes[indexOfChord].id;
        }

        // Create a chordNode and bind it to all 3 nodes (origin, neighborNode, commonNeighbor)
        graph.addLink({source: originNode,     target: chordId});
        graph.addLink({source: neighborNode,   target: chordId});
        graph.addLink({source: commonNeighbor, target: chordId});
      }
    });    
  });
}

// This function could be reviewed with new coordinates system
function chordIsAugmented(i, j, k) 
{
  let c = [i, j, k].sort((a, b) => a - b);
  return (c[1]-c[0] === 4 && c[2]-c[0] === 8);
}

//---------------------------------------------------------------
// Bind all chord nodes according to common edges
//---------------------------------------------------------------
for(let originNode = 0; originNode < 12; ++originNode) {

  // For all edges, find all common edge node with origin
  let neighborNodes = graph
  .nodes[originNode]
  .edges
  .filter(edge => edge.target < 12)
  .map(edge => edge.target);  
  
  neighborNodes.forEach(neighborNode => 
  {    
    // Find all chords of both nodes
    let chordsOfOrigin = graph
      .nodes[originNode]
      .edges
      .filter(edge => edge.target >= 12)
      .map(edge => edge.target); 
      
    let chordsOfNeighbor = graph
      .nodes[neighborNode]
      .edges
      .filter(edge => edge.target >= 12)
      .map(edge => edge.target);
      
    // Find common chords    
    let commonChords = [];   
    
    // Compare each item of both chord arrays
    chordsOfOrigin.forEach( chordOfOrigin => 
    {
      chordsOfNeighbor.forEach( chordOfNeighbor => 
      {
        if(chordOfOrigin === chordOfNeighbor) 
        {
          commonChords.push(graph.nodes[chordOfOrigin]);
        }
      })
    });
    
    // Identify direction of movement    
    if(commonChords.length === 2) {
      
      // Find common notes
      let notesOfChord0 = commonChords[0].edges.map(edge => edge.target);
      let notesOfChord1 = commonChords[1].edges.map(edge => edge.target);

      let commonNotesId = [];      
      notesOfChord0.forEach( noteOfChord0 => 
      {
        notesOfChord1.forEach( noteOfChord1 => 
        {
          if(noteOfChord0 === noteOfChord1) 
          {
            commonNotesId.push(graph.nodes[noteOfChord0].id);
          }
        })
      });
      
      // Extract directions of notes
      let hasRoot = commonNotesId.some(note => note === commonChords[0].root);
      
      let directions = ["",""];       
      if(!hasRoot)
      {
        if(commonChords[0].voicing === "major") 
        { 
          directions = ["-z","+z"]; 
        } 
        else 
        { 
          directions = ["+y","-y"]; 
        }         
      } 
      else 
      {                
        if( graph.nodes[commonNotesId[0]].edges[dirIndex("-x")].target === commonNotesId[1]
         || graph.nodes[commonNotesId[1]].edges[dirIndex("-x")].target === commonNotesId[0]) 
        {
          
          if(commonChords[0].voicing === "major") 
          { 
            directions = ["-x","+x"]; 
          } 
          else 
          { 
            directions = ["+x","-x"]; 
          } 
        }
        else {
          
          if(commonChords[0].voicing === "major") 
          { 
            directions = ["-y","+y"]; 
          } 
          else 
          { 
            directions = ["+z","-z"]; 
          } 
        }
      }
      graph.addLink({ source: commonChords[0].id, target: commonChords[1].id, direction: directions[0] });
      graph.addLink({ source: commonChords[1].id, target: commonChords[0].id, direction: directions[1] });
    } 
    else 
    {
      console.error("Unexpected number of common notes between neighbor chords");
    }    
  });  
}

//---------------------------------------------------------------
// HELPER FUNCTION : commonElementsOfArrays
//---------------------------------------------------------------
function commonElementsOfArrays(array1, array2) {
  
  let returnedArray = [];   
  array1.forEach( array1element => 
  {
    array2.forEach( array2element => 
    {
      if(array1element === array2element) returnedArray.push(array1element);
    })
  });
  return returnedArray;
}

//---------------------------------------------------------------
// Graph highlight
//---------------------------------------------------------------

graph.nodeClick = node => 
{  
  d3.selectAll(".link")
    .filter( d => d.source.id === node.id || d.target.id === node.id)
    .style("stroke", "red");
  
  let relevantNodesTarget = graph
  .links.filter(d => d.source.id === node.id)
  .map(link => link.target.id);

  let relevantNodesSource = graph
  .links.filter(d => d.target.id === node.id)
  .map(link => link.source.id);

  let relevantNodes = relevantNodesTarget.concat(relevantNodesSource).concat([node.id]);
  d3.selectAll(".node")
    .filter(d => relevantNodes.includes(d.id))
    .style("stroke", "red");
}

graph.nodeRelease = node => 
{   
  d3.selectAll(".node").style("stroke", "#777");
  d3.selectAll(".link").style("stroke", "#777");
}


//---------------------------------------------------------------
// Clean up graph for query
//---------------------------------------------------------------
let tonnetze = [];
graph.nodes.forEach(node => 
{
  let nodeObject = {edges: {}, id: node.id, type: node.type }; 
  if(node.type === "chord") 
  { 
    nodeObject.voicing = node.voicing; 
  }
  
  node.edges.forEach(edge => 
  {     
    let edgeDirection = "";
    let targetIsNote = edge.target < 12;
    let edgeType = targetIsNote ? "note" : "chord";
        
    if(node.type === "note" && targetIsNote) 
    { 
      nodeObject.edges[edge.direction] = edge.target;       
      if(!nodeObject.hasOwnProperty("neighbors")) 
      { 
        nodeObject.neighbors = []; 
      }
      nodeObject.neighbors.push(edge.target); 
    }
    else if(node.type === "chord" && !targetIsNote) 
    { 
      nodeObject.edges[edge.direction] = edge.target;      
      if(!nodeObject.hasOwnProperty("neighbors")) 
      { 
        nodeObject.neighbors = []; 
      }
      nodeObject.neighbors.push(edge.target);  
    } 
    else 
    {
      if(node.type === "chord") 
      {                
        if(edge.target === node.root) 
        { 
          nodeObject.root = edge.target; 
        }
        else if(edge.target === (node.root + 7) % 12) 
        { 
          nodeObject.fifth = edge.target; 
        }
        else 
        { 
          nodeObject.third = edge.target; 
        }
        
        if(!nodeObject.hasOwnProperty("notes")) 
        { 
          nodeObject.notes = []; 
        }
        nodeObject.notes.push(edge.target); 
      }
      else 
      {
        if(!nodeObject.hasOwnProperty("chords")) 
        { 
          nodeObject.chords = []; 
        }
        nodeObject.chords.push(edge.target);      
      }
    }
  });
  
  tonnetze.push(nodeObject);  
});

console.log(tonnetze)

//---------------------------------------------------------------
// Creating scale and chords patterns
//---------------------------------------------------------------

let scalePatterns = 
{
  major:      [["+x"],["-x"],["+y"],["+z"],["+y","+x"],["+x","+x"]],
  minor:      [["+x"],["-x"],["-y"],["-z"],["-x","-x"],["+x","+x"]],
  pentaMajor: [["+x"],["+y"],["+z"],["+x","+x"]],
  pentaMinor: [["+x"],["-x"],["-z"],["-x","-x"],],
  blues:      [["-x"],["+x"],["-z"],["-z","+x"],["-z","-z"]]
}

// Retrieve notes according to scale pattern
function getScaleNotes(root, scale)
{  
  let scaleNotes = [root];    
  scalePatterns[scale].forEach( pattern => 
  {
    let currentNode = root;
    pattern.forEach(move => currentNode = tonnetze[currentNode].edges[move]);
    scaleNotes.push(tonnetze[currentNode].id);
  });
  return scaleNotes.sort((a,b) => a - b);
}

// Find chord major and minor chords
function getScaleChords(root, scale)
{
  // List all chord node of each note
  // Count each chord appearance
  // Keep only chords with 3 appearances
  let chordsFound = [];
  let scaleChords = [];
  
  // Get scales notes 
  let scaleNotes = getScaleNotes(root, scale);  
  scaleNotes.forEach(note => tonnetze[note].chords.forEach(chord => chordsFound.push(chord)));  
  chordsFound.sort((a,b) => a - b);
  
  let chordCount = 0;  
  let currentChord = -1;
  for(let i = 0; i < chordsFound.length; ++i)
  {
    if(i === 0) 
    { 
      currentChord = chordsFound[i];
      ++chordCount; 
      continue; 
    }
    
    if(chordsFound[i] != currentChord)
    {
      chordCount = 1;
      currentChord = chordsFound[i];
      continue;
    }
        
    if(++chordCount >= 3)
    {
      scaleChords.push(currentChord);      
      chordCount = 1;
    }    
  }
  return scaleChords;
}

// Find all chords of a scale
let chordPatterns = 
{
  major:      [["+x"],["+y"]],
  minor:      [["+x"],["-z"]],
  augmented:  [["+y"],["+y","+y"]],
  diminished: [["-z"],["-z","-z"]],
  extensions : {
    m7th:       [["+x"],["-z"]],
    M7th:       [["+x"],["+y"]],
    M9th:       [["+x"],["+x"]],
    m6th:       [["-y"]],
    M6th:       [["+z"]]
  }
}

function getAllScaleChords(root, scale)
{
  let scaleNotes = getScaleNotes(root, scale);
  let scaleChords = [];
  
  scaleNotes.forEach( origin => 
  { 
    
    ["major","minor"].forEach(voicing => 
    {
      let voicingPresent = !chordPatterns[voicing].some( edge => !scaleNotes.includes(tonnetze[origin].edges[edge]))

      if(voicingPresent) 
      {
        // Check for major extensions
        let extensions = [];
        for(let extension in chordPatterns.extensions)
        {        
          // Do the moves
          let pattern = chordPatterns.extensions[extension];  
          let currentNote = origin;
          pattern.forEach(move => currentNote = tonnetze[currentNote].edges[move]);
          if(scaleNotes.includes(currentNote)) { extensions.push(extension); }          
        }
        
        scaleChords.push({root: origin, voicing: voicing, extensions: extensions});        
      }
    });
    
    ["augmented", "diminished"].forEach( voicing => 
    {      
      let voicingPresent = !chordPatterns[voicing].some( pattern => 
      {
        // Do the moves
        let currentNote = origin;
        pattern.forEach(move => currentNote = tonnetze[currentNote].edges[move]);
        
        // Check the resulting note
        return !scaleNotes.includes(currentNote);
      });    

      if(voicingPresent) 
      { 
        scaleChords.push({root: origin, voicing: voicing, extensions: []}); 
      }       
    });    
    
  }); // end of scaleNotes.forEach
  
  return scaleChords;
}

console.log(JSON.stringify(tonnetze));

/*
Interesting resource...
https://imgur.com/a/aWIhR
*/

//tonnetze = JSON.parse([{\"edges\":{\"+x\":7,\"+y\":4,\"+z\":9,\"-x\":5,\"-y\":8,\"-z\":3},\"id\":0,\"type\":\"note\",\"neighbors\":[7,4,9,5,8,3],\"chords\":[12,13,14,15,16,17]},{\"edges\":{\"+x\":8,\"+y\":5,\"+z\":10,\"-x\":6,\"-y\":9,\"-z\":4},\"id\":1,\"type\":\"note\",\"neighbors\":[8,5,10,6,9,4],\"chords\":[18,19,20,21,22,23]},{\"edges\":{\"+x\":9,\"+y\":6,\"+z\":11,\"-x\":7,\"-y\":10,\"-z\":5},\"id\":2,\"type\":\"note\",\"neighbors\":[9,6,11,7,10,5],\"chords\":[24,25,26,27,28,29]},{\"edges\":{\"+x\":10,\"+y\":7,\"+z\":0,\"-x\":8,\"-y\":11,\"-z\":6},\"id\":3,\"type\":\"note\",\"neighbors\":[10,7,0,8,11,6],\"chords\":[13,17,30,31,32,33]},{\"edges\":{\"+x\":11,\"+y\":8,\"+z\":1,\"-x\":9,\"-y\":0,\"-z\":7},\"id\":4,\"type\":\"note\",\"neighbors\":[11,8,1,9,0,7],\"chords\":[12,14,19,23,34,35]},{\"edges\":{\"+x\":0,\"+y\":9,\"+z\":2,\"-x\":10,\"-y\":1,\"-z\":8},\"id\":5,\"type\":\"note\",\"neighbors\":[0,9,2,10,1,8],\"chords\":[15,16,18,20,25,29]},{\"edges\":{\"+x\":1,\"+y\":10,\"+z\":3,\"-x\":11,\"-y\":2,\"-z\":9},\"id\":6,\"type\":\"note\",\"neighbors\":[1,10,3,11,2,9],\"chords\":[21,22,24,26,31,33]},{\"edges\":{\"+x\":2,\"+y\":11,\"+z\":4,\"-x\":0,\"-y\":3,\"-z\":10},\"id\":7,\"type\":\"note\",\"neighbors\":[2,11,4,0,3,10],\"chords\":[12,13,27,28,30,35]},{\"edges\":{\"+x\":3,\"+y\":0,\"+z\":5,\"-x\":1,\"-y\":4,\"-z\":11},\"id\":8,\"type\":\"note\",\"neighbors\":[3,0,5,1,4,11],\"chords\":[16,17,18,19,32,34]},{\"edges\":{\"+x\":4,\"+y\":1,\"+z\":6,\"-x\":2,\"-y\":5,\"-z\":0},\"id\":9,\"type\":\"note\",\"neighbors\":[4,1,6,2,5,0],\"chords\":[14,15,22,23,24,25]},{\"edges\":{\"+x\":5,\"+y\":2,\"+z\":7,\"-x\":3,\"-y\":6,\"-z\":1},\"id\":10,\"type\":\"note\",\"neighbors\":[5,2,7,3,6,1],\"chords\":[20,21,28,29,30,31]},{\"edges\":{\"+x\":6,\"+y\":3,\"+z\":8,\"-x\":4,\"-y\":7,\"-z\":2},\"id\":11,\"type\":\"note\",\"neighbors\":[6,3,8,4,7,2],\"chords\":[26,27,32,33,34,35]},{\"edges\":{\"-x\":13,\"-y\":14,\"-z\":35},\"id\":12,\"type\":\"chord\",\"voicing\":\"major\",\"root\":0,\"notes\":[0,7,4],\"fifth\":7,\"third\":4,\"neighbors\":[13,14,35]},{\"edges\":{\"+x\":12,\"+z\":17,\"+y\":30},\"id\":13,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":0,\"notes\":[0,7,3],\"fifth\":7,\"third\":3,\"neighbors\":[12,17,30]},{\"edges\":{\"+y\":12,\"+z\":15,\"+x\":23},\"id\":14,\"type\":\"chord\",\"voicing\":\"minor\",\"third\":0,\"notes\":[0,4,9],\"fifth\":4,\"root\":9,\"neighbors\":[12,15,23]},{\"edges\":{\"-z\":14,\"-x\":16,\"-y\":25},\"id\":15,\"type\":\"chord\",\"voicing\":\"major\",\"fifth\":0,\"notes\":[0,9,5],\"third\":9,\"root\":5,\"neighbors\":[14,16,25]},{\"edges\":{\"+x\":15,\"+y\":17,\"+z\":18},\"id\":16,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":0,\"notes\":[0,5,8],\"root\":5,\"third\":8,\"neighbors\":[15,17,18]},{\"edges\":{\"-y\":16,\"-z\":13,\"-x\":32},\"id\":17,\"type\":\"chord\",\"voicing\":\"major\",\"third\":0,\"notes\":[0,8,3],\"root\":8,\"fifth\":3,\"neighbors\":[16,13,32]},{\"edges\":{\"-x\":19,\"-y\":20,\"-z\":16},\"id\":18,\"type\":\"chord\",\"voicing\":\"major\",\"root\":1,\"notes\":[1,8,5],\"fifth\":8,\"third\":5,\"neighbors\":[19,20,16]},{\"edges\":{\"+x\":18,\"+z\":23,\"+y\":34},\"id\":19,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":1,\"notes\":[1,8,4],\"fifth\":8,\"third\":4,\"neighbors\":[18,23,34]},{\"edges\":{\"+y\":18,\"+z\":21,\"+x\":29},\"id\":20,\"type\":\"chord\",\"voicing\":\"minor\",\"third\":1,\"notes\":[1,5,10],\"fifth\":5,\"root\":10,\"neighbors\":[18,21,29]},{\"edges\":{\"-z\":20,\"-x\":22,\"-y\":31},\"id\":21,\"type\":\"chord\",\"voicing\":\"major\",\"fifth\":1,\"notes\":[1,10,6],\"third\":10,\"root\":6,\"neighbors\":[20,22,31]},{\"edges\":{\"+x\":21,\"+y\":23,\"+z\":24},\"id\":22,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":1,\"notes\":[1,6,9],\"root\":6,\"third\":9,\"neighbors\":[21,23,24]},{\"edges\":{\"-y\":22,\"-z\":19,\"-x\":14},\"id\":23,\"type\":\"chord\",\"voicing\":\"major\",\"third\":1,\"notes\":[1,9,4],\"root\":9,\"fifth\":4,\"neighbors\":[22,19,14]},{\"edges\":{\"-x\":25,\"-y\":26,\"-z\":22},\"id\":24,\"type\":\"chord\",\"voicing\":\"major\",\"root\":2,\"notes\":[2,9,6],\"fifth\":9,\"third\":6,\"neighbors\":[25,26,22]},{\"edges\":{\"+x\":24,\"+z\":29,\"+y\":15},\"id\":25,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":2,\"notes\":[2,9,5],\"fifth\":9,\"third\":5,\"neighbors\":[24,29,15]},{\"edges\":{\"+y\":24,\"+z\":27,\"+x\":33},\"id\":26,\"type\":\"chord\",\"voicing\":\"minor\",\"third\":2,\"notes\":[2,6,11],\"fifth\":6,\"root\":11,\"neighbors\":[24,27,33]},{\"edges\":{\"-z\":26,\"-x\":28,\"-y\":35},\"id\":27,\"type\":\"chord\",\"voicing\":\"major\",\"fifth\":2,\"notes\":[2,11,7],\"third\":11,\"root\":7,\"neighbors\":[26,28,35]},{\"edges\":{\"+x\":27,\"+y\":29,\"+z\":30},\"id\":28,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":2,\"notes\":[2,7,10],\"root\":7,\"third\":10,\"neighbors\":[27,29,30]},{\"edges\":{\"-y\":28,\"-z\":25,\"-x\":20},\"id\":29,\"type\":\"chord\",\"voicing\":\"major\",\"third\":2,\"notes\":[2,10,5],\"root\":10,\"fifth\":5,\"neighbors\":[28,25,20]},{\"edges\":{\"-x\":31,\"-y\":13,\"-z\":28},\"id\":30,\"type\":\"chord\",\"voicing\":\"major\",\"root\":3,\"notes\":[3,10,7],\"fifth\":10,\"third\":7,\"neighbors\":[31,13,28]},{\"edges\":{\"+x\":30,\"+z\":33,\"+y\":21},\"id\":31,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":3,\"notes\":[3,10,6],\"fifth\":10,\"third\":6,\"neighbors\":[30,33,21]},{\"edges\":{\"+x\":17,\"+y\":33,\"+z\":34},\"id\":32,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":3,\"notes\":[3,8,11],\"root\":8,\"third\":11,\"neighbors\":[17,33,34]},{\"edges\":{\"-y\":32,\"-z\":31,\"-x\":26},\"id\":33,\"type\":\"chord\",\"voicing\":\"major\",\"third\":3,\"notes\":[3,11,6],\"root\":11,\"fifth\":6,\"neighbors\":[32,31,26]},{\"edges\":{\"-x\":35,\"-y\":19,\"-z\":32},\"id\":34,\"type\":\"chord\",\"voicing\":\"major\",\"root\":4,\"notes\":[4,11,8],\"fifth\":11,\"third\":8,\"neighbors\":[35,19,32]},{\"edges\":{\"+x\":34,\"+z\":12,\"+y\":27},\"id\":35,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":4,\"notes\":[4,11,7],\"fifth\":11,\"third\":7,\"neighbors\":[34,12,27]}]);
