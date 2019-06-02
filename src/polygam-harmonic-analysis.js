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
  var chordsAsI = getAllChordsOfScale(iChord.root, voicingAsI).map(a => a[0]).filter(c => c.voicing != "diminished");
  // Add chord names
  chordsAsI.forEach(chord => { chord.name = buildChordName(chord); });

  // List chords of scale as if input chord is V
  var chordsAsV = getAllChordsOfScale(rootAsV, voicingAsV).map(a => a[0]).filter(c => c.voicing != "diminished");;
  // Add chord names
  chordsAsV.forEach(chord => { chord.name = buildChordName(chord); });

  // List chords of scale as if input chord is VI
  // Switch voicing
  var chordsAsVI = getAllChordsOfScale(rootAsVI, voicingAsVI).map(a => a[0]).filter(c => c.voicing != "diminished");;
  // Add chord names
  chordsAsVI.forEach(chord => { chord.name = buildChordName(chord); });


  // By comparing chord names, build list of all chords
  var chordsForGraph = [];
  chordsForGraph.concat(chordsAsI);
  
  chordsAsV.forEach(chord => 
  {
    if(!chordsForGraph.map(c => c.id).includes(chord.id))
    {
      chordsForGraph.push(chord);
    }
  });
  
  chordsAsVI.forEach(chord => 
  {
    if(!chordsForGraph.map(c => c.id).includes(chord.id))
    {
      chordsForGraph.push(chord);
    }
  });

  
  // add first brighter(+5)/darker(+7) scale stranger chord
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
      brighterDarkerChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["-y","+z","-y","+z"])]);
      brighterDarkerChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["-z","+y","-z"])]);
    }
    else
    {
      brighterDarkerChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["+z","-y","+z"])]);
      brighterDarkerChords.push(tonnetze[tonnetzeMove(tonnetzeId, ["+y","-z","+y","-z"])]);
    }
  });
  
  brighterDarkerChords.forEach(chord => { chord.name = buildChordName(chord); });
  brighterDarkerChords.forEach(chord => 
  {
    if(!chordsForGraph.map(c => c.id).includes(chord.id))
    {
      chordsForGraph.push(chord);
    }
  });
    
  
  
  //
  // add IV/V and V/V of IV and V
  //
  var extendedChords = [];
  [[rootAsI, voicingAsI], [rootAsV, voicingAsV], [rootAsVI, voicingAsVI]].forEach(array =>
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
  
  extendedChords.forEach(chord => { chord.name = buildChordName(chord); });
  extendedChords.forEach(chord => 
  {
    if(!chordsForGraph.map(c => c.id).includes(chord.id))
    {
      chordsForGraph.push(chord);
    }
  });
    
    
  console.log(chordsForGraph);

  // add major/minor potential borrowings
  // LETS KEEP THAT FOR LATER!!!

  // Build output
  /*
  {
    nodes : [{name, voicing, root}],
    links : [],
  }
*/
}

function buildChordName(iChord)
{
  return ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
}