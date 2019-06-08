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
      buildChordName(chord);
      filteredScaleChords.push(chord);
    }
  });

  var filteredExtendedChords = [];
  extendedChords.forEach( chord =>
  {
    if(!filteredExtendedChords.map(c => c.id).includes(chord.id) && !filteredScaleChords.map(c => c.id).includes(chord.id))
    {
      buildChordName(chord);
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


function nextGraph(iProgression, iMaxLookBehind, iCurrentGraph)
{ 

  if(iProgression.length < 2) { console.error("Something went wrong, the progression should have 2 chords or more at this point"); return; }

  let chords = [];

  for(let i = iProgression.length > iMaxLookBehind ? iMaxLookBehind :iProgression.length; i > 0; --i)
  {
    chords.push(iProgression[iProgression.length - i]);
  }

  // List all different permutation of the chords
  let permutationsBoolMap = boolArrayOfPermutations(chords.length);

  let permutations = [];
  permutationsBoolMap.forEach( boolArray =>
  {
    let permutationInstance = [];

    for(let i = 0; i < chords.length; ++i)
    {
      if(boolArray[i])
      {
        permutationInstance.push(chords[i]);
      }
    }
    permutations.push(permutationInstance);
    
  });

  // Find all the scales where all these chords belong
  let relatableScales = [];
  permutations.forEach(permutationOfChords => 
  {
    permutationOfChords.forEach(chord => 
    {
      relatableScales = relatableScales.concat(getScalesOfChord(chord));
    });

  });
  
  // Remove least occuring scales
  let reoccuringScales = [];
  relatableScales.forEach(scale =>
  {
    if(relatableScales.filter(ps => ps.root === scale.root && ps.voicing === scale.voicing).length >= 2)
    {
      if(!reoccuringScales.filter(ps => ps.root === scale.root && ps.voicing === scale.voicing).length)
      {
        scale.occurences = 1;
        reoccuringScales.push(scale);
      }
      else
      {
        reoccuringScales.find(rs => { return rs.root === scale.root && rs.voicing === scale.voicing; }).occurences++;
      }
    }
  });
  
  // Consider here that we might have no commonscales, then we should take a step back to offer other possibilities
  if(reoccuringScales.length === 0)
  {
    // consider adding major/minor flip in the equation 
    // or just put all the chords as if they were both the first chord
    // something... later...
    // for now just take the roots of both chords
    reoccuringScales = chords.map(chord => { return { root: chord.root, voicing: chord.voicing, occurences: 1 }; });
    
  }
  
  // Keep the most occuring scales
  let averageOccurence = reoccuringScales.map(s => s.occurences).reduce((sum, value) => sum += value, 0) / reoccuringScales.length;
  let candidateScales = reoccuringScales.filter(scale => scale.occurences >= averageOccurence);
  
  // Calculate polarity score of the candidate scales
  candidateScales.forEach(scale => 
  {
    scale.polarity = chords.reduce((polarity, chord) => polarity += tonnetzeChordTension(scale, chord), 0);
  });
    
  
  // Sort with lowest polarity first
  candidateScales = candidateScales.sort((a,b) => Math.abs(a.polarity) > Math.abs(b.polarity));
  
  
  // Keep the most scales with polarity above average
  let averagePolarity = candidateScales.map(s => s.polarity).reduce((sum, value) => sum += value, 0) / candidateScales.length;
  let finalScales = candidateScales.filter(scale => scale.polarity >= averagePolarity);
  
  
  // Keep every chords from finalScales chords
  let finalChords = [];
  finalScales.forEach(scale =>
  {    
    getAllChordsOfScale(scale.root, scale.voicing)
    .filter(c => c.voicing != "diminished")
    .forEach(chord => 
    {
      if(!finalChords.map(c => c.id).includes(chord.id))
      {
        buildChordName(chord);
        finalChords.push(chord);
      }
    });
  });
    
  // Compare to current graph state

  let returnedObject = { addNodes: [], delNodes: [], addLinks: [], delLinks: [] };
  /* Expected content :
  {
    addNodes : ["Cm","F#"],
    delNodes : [],
    addLinks : [{"source: F#", target: "Db"},{"source: Db", target: "A"} ],
    delLinks : [{"source: A", target: "C"}]
  }
  */

  finalChords.forEach(chord => 
  {
    // Chords to add
    if(!iCurrentGraph.nodes.includes(chord.nameFlat) && !iCurrentGraph.nodes.includes(chord.nameSharp))
    {
      returnedObject.addNodes.push(chord.name);
    }
  });

  
  returnedObject.addNodes.forEach(chordName => 
  {
    // List neighbor chords 
    tonnetze[findChordTonnetzeIdByName(chordName)].neighbors.forEach(neighbor => 
    {
      let neighborName = tonnetze[neighbor].name;

      // Add links if chords are present
      if(returnedObject.addNodes.includes(neighborName) || iCurrentGraph.nodes.includes(neighborName))
      {
        returnedObject.addLinks.push({source: chordName, target: neighborName});
        returnedObject.addLinks.push({source: neighborName, target: chordName});
      }
    });
  });

  return returnedObject;
}

function buildChordName(iChord)
{
  iChord.name       = ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
  iChord.nameFlat   = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
  iChord.nameSharp  = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][iChord.root] + (iChord.voicing === "minor" ? "m" : "");
  return iChord;
}

function boolArrayOfPermutations(iBitCount)
{
  let returnedArray = [];
  for(let i = 1; i < Math.pow(2,iBitCount); ++i)
  {
    let temp = i.toString(2).split("").map(b => b == 1);
    
    // Only add permutations with more than one positive
    if(temp.filter(b => b === true).length > 1)
    {
      returnedArray.push(temp);
    }
  }
  return returnedArray;
}


// Relative minors have the same tonic pole => Am and C pole is the C-E triad
function tonnetzeChordTension(iSource, iDestination) // based on root and voicing properties
{
  if(iSource.root === iDestination.root && iSource.voicing === iDestination.voicing)
  {
    return 0;
  }
  
  // Is chord major or minor (to establish the "handicap" depending on where is the tonic pole and in what direction we're going)
  let tensionLeft  = iSource.voicing === "major" ?  1 : 0;
  let tensionRight = iSource.voicing === "minor" ? -1 : 0;
  
  srcNode = tonnetze.find(node => node.root == iSource.root && node.voicing == iSource.voicing);
  dstNode = tonnetze.find(node => node.root == iDestination.root && node.voicing == iDestination.voicing);
  
  if(srcNode === undefined || dstNode === undefined)
  {
    console.error("Undefined tonnetze node in tension calculation");
    return 0;
  }
  
  // Set initial node
  let visitedNode = srcNode;
  
  // Left direction
  // "-y" && "+z" add negative tension value
  while(visitedNode.id != dstNode.id)
  {
    if(visitedNode.edges.hasOwnProperty("-y"))
    {
      visitedNode = tonnetze[visitedNode.edges["-y"]];
      --tensionLeft;
    }
    else if(visitedNode.edges.hasOwnProperty("+z"))
    {
      visitedNode = tonnetze[visitedNode.edges["+z"]];
      --tensionLeft;
    }
    else
    {
      console.error("Something went wrong, a chord node should have at least a -y or +z edge");
    }
  }
  
  // Reset initial node
  visitedNode = srcNode;
  
  // Right direction
  // "-z" && "+y" add positive tension value
  while(visitedNode.id != dstNode.id)
  {
    if(visitedNode.edges.hasOwnProperty("+y"))
    {
      visitedNode = tonnetze[visitedNode.edges["+y"]];
      ++tensionRight;
    }
    else if(visitedNode.edges.hasOwnProperty("-z"))
    {
      visitedNode = tonnetze[visitedNode.edges["-z"]];
      ++tensionRight;
    }
    else
    {
      console.error("Something went wrong, a chord node should have at least a +y or -z edge");
    }
  }

  // Return the tension with the smallest absolute value
  return Math.abs(tensionLeft) < tensionRight ? tensionLeft : tensionRight;

}