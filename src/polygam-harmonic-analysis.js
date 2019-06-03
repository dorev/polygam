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
  //var chordsAsVI = getAllChordsOfScale(rootAsVI,    voicingAsVI).map(a => a[0]).filter(c => c.voicing != "diminished");

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

function buildChordName(iChord)
{
  return ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
}