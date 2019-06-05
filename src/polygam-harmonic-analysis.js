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
  var chordsAsI  = getAllChordsOfScale(iChord.root, voicingAsI).filter(c => c.voicing != "diminished");
  var chordsAsV  = getAllChordsOfScale(rootAsV,     voicingAsV).filter(c => c.voicing != "diminished");
  //var chordsAsVI = getAllChordsOfScale(rootAsVI,    voicingAsVI).filter(c => c.voicing != "diminished");

  var scaleChords = [];
  scaleChords = scaleChords.concat(chordsAsI, chordsAsV/*, chordsAsVI*/);
  
  // add first brighter(+5st)/darker(+7st) scale stranger chord
  // C-Am first brighter => Bb
  // C-Am first darker => Bm
  var extendedChords = [];
  [[rootAsI, voicingAsI], [rootAsV, voicingAsV],/* [rootAsVI, voicingAsVI]*/].forEach(array =>
  {    
    var root = array[0];
    var voicing = array[1];
    var tonnetzeId = findChordTonnetzeId(root, voicing);
    
    if(voicing === "major")
    {
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["-y","+z","-y","+z"])]);
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["-z","+y","-z"])]);
    }
    else
    {
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["+z","-y","+z"])]);
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["+y","-z","+y","-z"])]);
    }
  });
  
  
  //
  // Add IV/V and V/V
  //
  [[rootAsI, voicingAsI], [rootAsV, voicingAsV]/*, [rootAsVI, voicingAsVI]*/].forEach(array =>
  {    
    var root = array[0];
    var voicing = array[1];
    var tonnetzeId = findChordTonnetzeId(root, voicing);
    
    if(voicing === "major")
    {
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["-z","+y","-z","+y"])]); // V/V
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["-y","+z","-y","+z"])]); // IV/IV
    }
    else
    {
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["+y","-z","+y","-z"])]); // V/V
      extendedChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["+z","-y","+z","-y"])]); // IV/IV
    }
  });

  var filteredScaleChords = [];
  scaleChords.forEach( chord =>
  {
    if(!filteredScaleChords.map(c => c.id).includes(chord.id))
    {
      chord.name = buildChordName(chord);
      filteredScaleChords.push(chord);
    }
  });

  var filteredExtendedChords = [];
  extendedChords.forEach( chord =>
  {
    if(!filteredExtendedChords.map(c => c.id).includes(chord.id) && !filteredScaleChords.map(c => c.id).includes(chord.id))
    {
      chord.name = buildChordName(chord);
      filteredExtendedChords.push(chord);
    }
  });


  //
  // add major/minor potential borrowings
  // LETS KEEP THAT FOR LATER!!!
  //
  

  var returnedObject = 
  { 
    scaleChords:    filteredScaleChords   .map(chord => { return { name: chord.name, voicing: chord.voicing, root: chord.root, id: chord.id }; }) , 
    extendedChords: filteredExtendedChords.map(chord => { return { name: chord.name, voicing: chord.voicing, root: chord.root, id: chord.id }; }) 
  };

  return returnedObject;
}

function nextGraph(iProgression, iMaxLookback, iCurrentGraph)
{ 

  if(iProgression.length < 2) { console.error("Something went wrong, the progression should have 2 chords or more at this point"); return; }

  // Extract at most the 4 last chords of the progression
  let chords = [];
  for(let i = iProgression.length > 3 ? 3 :iProgression.length; i > 0; --i)
  {
    chords.push(iProgression[iProgression.length - i]);
  }

  // Find all the scales where all these chords belong
  let potentialScales = [];
  chords.forEach(chord => 
  {
    potentialScales = potentialScales.concat(getScalesOfChord(chord));
  });

  console.log(potentialScales);
  
  // Remove least occuring scales
  // Might add more loose here... as if we considered the chords as 5ths of their scales
  let relevantScales = [];
  potentialScales.forEach(scale =>
  {
    if(potentialScales.filter(ps => ps.root === scale.root && ps.voicing === scale.voicing).length >= 2)
    {
      if(!relevantScales.filter(ps => ps.root === scale.root && ps.voicing === scale.voicing).length)
      {
        relevantScales.push(scale);
      }
    }
  });


  console.log(relevantScales);


  // we should add the current graph as input
  // iCurrentGraph --> { nodes: ["Cm","F#"], links: [{source: "F#", target: "Db"},{source: "Db", target: "A"}]};

  // STAY TONNETZE BASED!! DON'T GO "FULL HARMONIC NERD"

  // according to the last chords, establish the most likely scales played




  // calculate tension created in regard of the "tonic pole" of each move
  // base on the most likely scales

  // relative minors have the same tonic pole => Am and C pole is the C-E triad
  // "-z" && "+y" add positive tension value
  // "-y" && "+z" add negative tension value
  
  // ?? maybe firstChordNeighbors() could be reused here somehow...
  
  // 


  // use current graph vs next to list modifications

  var returnedObject = { addNodes: [], delNodes: [], addLinks: [], delLinks: [] };
  /*
  {
    addNodes : ["Cm","F#"],
    delNodes : [],
    addLinks : [{"source: F#", target: "Db"},{"source: Db", target: "A"} ],
    delLinks : [{"source: A", target: "C"}]
  }
  */
 return returnedObject;
}

function buildChordName(iChord)
{
  return ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
}