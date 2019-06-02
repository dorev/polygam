function firstChordNeighbors(iChord)
{
  // Validate chord object
  if(!(iChord.hasOwnProperty("root") && iChord.hasOwnProperty("voicing")))
  {
    console.error("Chord is missing a 'root' or 'voicing' property");
  }

  var rootAsI = iChord.root;
  var rootAsV = (iChord.root + 5) % 12;
  var rootAsVI = (iChord.root + 3) % 12;
  var voicingAsI = iChord.voicing;
  var voicingAsV = iChord.voicing;
  var voicingAsVI = iChord.voicing === "major" ? "minor" : "major";

  // List chords of scale as if input chord is I
  var chordsAsI  = getAllChordsOfScale(iChord.root, voicingAsI).map(a => a[0]).filter(c => c.voicing != "diminished");
  var chordsAsV  = getAllChordsOfScale(rootAsV,     voicingAsV).map(a => a[0]).filter(c => c.voicing != "diminished");
  var chordsAsVI = getAllChordsOfScale(rootAsVI,    voicingAsVI).map(a => a[0]).filter(c => c.voicing != "diminished");

  var chordsForGraph = [];
  chordsForGraph = chordsForGraph.concat(chordsAsI, chordsAsV, chordsAsVI);
  
  // add first brighter(+5st)/darker(+7st) scale stranger chord
  // C-Am first brighter => Bb
  // C-Am first darker => Bm
  var brighterDarkerChords = [];
  [[rootAsI, voicingAsI], [rootAsV, voicingAsV], [rootAsVI, voicingAsVI]].forEach(array =>
  {    
    var root = array[0];
    var voicing = array[1];
    var tonnetzeId = findChordTonnetzeId(root, voicing);
    
    if(voicing === "major")
    {
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["-y","+z","-y","+z"])]);
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["-z","+y","-z"])]);
    }
    else
    {
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["+z","-y","+z"])]);
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["+y","-z","+y","-z"])]);
    }
  });
  
  
  //
  // Add IV/V and V/V
  //
  var extendedChords = [];
  [[rootAsI, voicingAsI], [rootAsV, voicingAsV], [rootAsVI, voicingAsVI]].forEach(array =>
  {    
    var root = array[0];
    var voicing = array[1];
    var tonnetzeId = findChordTonnetzeId(root, voicing);
    
    if(voicing === "major")
    {
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["-z","+y","-z","+y"])]); // V/V
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["-y","+z","-y","+z"])]); // IV/IV
    }
    else
    {
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["+y","-z","+y","-z"])]); // V/V
      chordsForGraph.push(tonnetze[tonnetzeMove(tonnetzeId, ["+z","-y","+z","-y"])]); // IV/IV
    }
  });

  var filteredChords = [];
  chordsForGraph.forEach( chord =>
  {
    if(!filteredChords.map(c => c.id).includes(chord.id))
    {
      chord.name = buildChordName(chord);
      filteredChords.push(chord);
    }
  });

  //
  // add major/minor potential borrowings
  // LETS KEEP THAT FOR LATER!!!
  //
  
  // Build output
  var returnedObject = { nodes: [], links: [] };
  
  // Add all nodes from list of found chords
  filteredChords.forEach( chord =>
  {
    returnedObject.nodes.push({ name: chord.name, voicing: chord.voicing, root: chord.root, id: chord.id });
  });

  // For each node, add existing edges to any other tonnetze node
  returnedObject.nodes.forEach( node =>
  {
    tonnetze[node.id].neighbors.forEach(neighbor => 
    {
      if(returnedObject.nodes.map(n => n.id).includes(node.id))
      {
        returnedObject.links.push({ source: node.name, target: buildChordName(tonnetze[neighbor]) })
      }
    });
  });

  //{
  //  nodes : [{name, voicing, root, tonnetzeId}],
  //  links : [{sourceTonnetzeId, targetTonnetzeId}]
  //}
  //console.log(returnedObject);

  return returnedObject;
}

function buildChordName(iChord)
{
  return ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
}