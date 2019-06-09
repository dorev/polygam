// review chord coordinates in graph
// all positive chord edge should lead to a major chord
// all negative chord edge should lead to a minor chord

// chord polarity
    // define scales visited during progression
    // used to identify what modulations are relevant and how likely they are

// define elasticity
    // number of different scales authorized to explore in a single progression


const tonnetze = JSON.parse("[{\"edges\":{\"+x\":7,\"+y\":4,\"+z\":9,\"-x\":5,\"-y\":8,\"-z\":3},\"id\":0,\"type\":\"note\",\"neighbors\":[7,4,9,5,8,3],\"chords\":[12,13,14,15,16,17],\"name\":\"C\",\"nameSharp\":\"C\",\"nameFlat\":\"C\"},{\"edges\":{\"+x\":8,\"+y\":5,\"+z\":10,\"-x\":6,\"-y\":9,\"-z\":4},\"id\":1,\"type\":\"note\",\"neighbors\":[8,5,10,6,9,4],\"chords\":[18,19,20,21,22,23],\"name\":\"C#\",\"nameSharp\":\"C#\",\"nameFlat\":\"Db\"},{\"edges\":{\"+x\":9,\"+y\":6,\"+z\":11,\"-x\":7,\"-y\":10,\"-z\":5},\"id\":2,\"type\":\"note\",\"neighbors\":[9,6,11,7,10,5],\"chords\":[24,25,26,27,28,29],\"name\":\"D\",\"nameSharp\":\"D\",\"nameFlat\":\"D\"},{\"edges\":{\"+x\":10,\"+y\":7,\"+z\":0,\"-x\":8,\"-y\":11,\"-z\":6},\"id\":3,\"type\":\"note\",\"neighbors\":[10,7,0,8,11,6],\"chords\":[13,17,30,31,32,33],\"name\":\"Eb\",\"nameSharp\":\"D#\",\"nameFlat\":\"Eb\"},{\"edges\":{\"+x\":11,\"+y\":8,\"+z\":1,\"-x\":9,\"-y\":0,\"-z\":7},\"id\":4,\"type\":\"note\",\"neighbors\":[11,8,1,9,0,7],\"chords\":[12,14,19,23,34,35],\"name\":\"E\",\"nameSharp\":\"E\",\"nameFlat\":\"E\"},{\"edges\":{\"+x\":0,\"+y\":9,\"+z\":2,\"-x\":10,\"-y\":1,\"-z\":8},\"id\":5,\"type\":\"note\",\"neighbors\":[0,9,2,10,1,8],\"chords\":[15,16,18,20,25,29],\"name\":\"F\",\"nameSharp\":\"F\",\"nameFlat\":\"F\"},{\"edges\":{\"+x\":1,\"+y\":10,\"+z\":3,\"-x\":11,\"-y\":2,\"-z\":9},\"id\":6,\"type\":\"note\",\"neighbors\":[1,10,3,11,2,9],\"chords\":[21,22,24,26,31,33],\"name\":\"F#\",\"nameSharp\":\"F#\",\"nameFlat\":\"Gb\"},{\"edges\":{\"+x\":2,\"+y\":11,\"+z\":4,\"-x\":0,\"-y\":3,\"-z\":10},\"id\":7,\"type\":\"note\",\"neighbors\":[2,11,4,0,3,10],\"chords\":[12,13,27,28,30,35],\"name\":\"G\",\"nameSharp\":\"G\",\"nameFlat\":\"G\"},{\"edges\":{\"+x\":3,\"+y\":0,\"+z\":5,\"-x\":1,\"-y\":4,\"-z\":11},\"id\":8,\"type\":\"note\",\"neighbors\":[3,0,5,1,4,11],\"chords\":[16,17,18,19,32,34],\"name\":\"Ab\",\"nameSharp\":\"G#\",\"nameFlat\":\"Ab\"},{\"edges\":{\"+x\":4,\"+y\":1,\"+z\":6,\"-x\":2,\"-y\":5,\"-z\":0},\"id\":9,\"type\":\"note\",\"neighbors\":[4,1,6,2,5,0],\"chords\":[14,15,22,23,24,25],\"name\":\"A\",\"nameSharp\":\"A\",\"nameFlat\":\"A\"},{\"edges\":{\"+x\":5,\"+y\":2,\"+z\":7,\"-x\":3,\"-y\":6,\"-z\":1},\"id\":10,\"type\":\"note\",\"neighbors\":[5,2,7,3,6,1],\"chords\":[20,21,28,29,30,31],\"name\":\"Bb\",\"nameSharp\":\"A#\",\"nameFlat\":\"Bb\"},{\"edges\":{\"+x\":6,\"+y\":3,\"+z\":8,\"-x\":4,\"-y\":7,\"-z\":2},\"id\":11,\"type\":\"note\",\"neighbors\":[6,3,8,4,7,2],\"chords\":[26,27,32,33,34,35],\"name\":\"B\",\"nameSharp\":\"B\",\"nameFlat\":\"B\"},{\"edges\":{\"-x\":13,\"-y\":14,\"-z\":35},\"id\":12,\"type\":\"chord\",\"voicing\":\"major\",\"root\":0,\"notes\":[0,7,4],\"fifth\":7,\"third\":4,\"neighbors\":[13,14,35],\"name\":\"C\",\"nameSharp\":\"C\",\"nameFlat\":\"C\"},{\"edges\":{\"+x\":12,\"+z\":17,\"+y\":30},\"id\":13,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":0,\"notes\":[0,7,3],\"fifth\":7,\"third\":3,\"neighbors\":[12,17,30],\"name\":\"Cm\",\"nameSharp\":\"Cm\",\"nameFlat\":\"Cm\"},{\"edges\":{\"+y\":12,\"+z\":15,\"+x\":23},\"id\":14,\"type\":\"chord\",\"voicing\":\"minor\",\"third\":0,\"notes\":[0,4,9],\"fifth\":4,\"root\":9,\"neighbors\":[12,15,23],\"name\":\"Am\",\"nameSharp\":\"Am\",\"nameFlat\":\"Am\"},{\"edges\":{\"-z\":14,\"-x\":16,\"-y\":25},\"id\":15,\"type\":\"chord\",\"voicing\":\"major\",\"fifth\":0,\"notes\":[0,9,5],\"third\":9,\"root\":5,\"neighbors\":[14,16,25],\"name\":\"F\",\"nameSharp\":\"F\",\"nameFlat\":\"F\"},{\"edges\":{\"+x\":15,\"+y\":17,\"+z\":18},\"id\":16,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":0,\"notes\":[0,5,8],\"root\":5,\"third\":8,\"neighbors\":[15,17,18],\"name\":\"Fm\",\"nameSharp\":\"Fm\",\"nameFlat\":\"Fm\"},{\"edges\":{\"-y\":16,\"-z\":13,\"-x\":32},\"id\":17,\"type\":\"chord\",\"voicing\":\"major\",\"third\":0,\"notes\":[0,8,3],\"root\":8,\"fifth\":3,\"neighbors\":[16,13,32],\"name\":\"Ab\",\"nameSharp\":\"G#\",\"nameFlat\":\"Ab\"},{\"edges\":{\"-x\":19,\"-y\":20,\"-z\":16},\"id\":18,\"type\":\"chord\",\"voicing\":\"major\",\"root\":1,\"notes\":[1,8,5],\"fifth\":8,\"third\":5,\"neighbors\":[19,20,16],\"name\":\"C#\",\"nameSharp\":\"C#\",\"nameFlat\":\"Db\"},{\"edges\":{\"+x\":18,\"+z\":23,\"+y\":34},\"id\":19,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":1,\"notes\":[1,8,4],\"fifth\":8,\"third\":4,\"neighbors\":[18,23,34],\"name\":\"C#m\",\"nameSharp\":\"C#m\",\"nameFlat\":\"Dbm\"},{\"edges\":{\"+y\":18,\"+z\":21,\"+x\":29},\"id\":20,\"type\":\"chord\",\"voicing\":\"minor\",\"third\":1,\"notes\":[1,5,10],\"fifth\":5,\"root\":10,\"neighbors\":[18,21,29],\"name\":\"Bbm\",\"nameSharp\":\"A#m\",\"nameFlat\":\"Bbm\"},{\"edges\":{\"-z\":20,\"-x\":22,\"-y\":31},\"id\":21,\"type\":\"chord\",\"voicing\":\"major\",\"fifth\":1,\"notes\":[1,10,6],\"third\":10,\"root\":6,\"neighbors\":[20,22,31],\"name\":\"F#\",\"nameSharp\":\"F#\",\"nameFlat\":\"Gb\"},{\"edges\":{\"+x\":21,\"+y\":23,\"+z\":24},\"id\":22,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":1,\"notes\":[1,6,9],\"root\":6,\"third\":9,\"neighbors\":[21,23,24],\"name\":\"F#m\",\"nameSharp\":\"F#m\",\"nameFlat\":\"Gbm\"},{\"edges\":{\"-y\":22,\"-z\":19,\"-x\":14},\"id\":23,\"type\":\"chord\",\"voicing\":\"major\",\"third\":1,\"notes\":[1,9,4],\"root\":9,\"fifth\":4,\"neighbors\":[22,19,14],\"name\":\"A\",\"nameSharp\":\"A\",\"nameFlat\":\"A\"},{\"edges\":{\"-x\":25,\"-y\":26,\"-z\":22},\"id\":24,\"type\":\"chord\",\"voicing\":\"major\",\"root\":2,\"notes\":[2,9,6],\"fifth\":9,\"third\":6,\"neighbors\":[25,26,22],\"name\":\"D\",\"nameSharp\":\"D\",\"nameFlat\":\"D\"},{\"edges\":{\"+x\":24,\"+z\":29,\"+y\":15},\"id\":25,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":2,\"notes\":[2,9,5],\"fifth\":9,\"third\":5,\"neighbors\":[24,29,15],\"name\":\"Dm\",\"nameSharp\":\"Dm\",\"nameFlat\":\"Dm\"},{\"edges\":{\"+y\":24,\"+z\":27,\"+x\":33},\"id\":26,\"type\":\"chord\",\"voicing\":\"minor\",\"third\":2,\"notes\":[2,6,11],\"fifth\":6,\"root\":11,\"neighbors\":[24,27,33],\"name\":\"Bm\",\"nameSharp\":\"Bm\",\"nameFlat\":\"Bm\"},{\"edges\":{\"-z\":26,\"-x\":28,\"-y\":35},\"id\":27,\"type\":\"chord\",\"voicing\":\"major\",\"fifth\":2,\"notes\":[2,11,7],\"third\":11,\"root\":7,\"neighbors\":[26,28,35],\"name\":\"G\",\"nameSharp\":\"G\",\"nameFlat\":\"G\"},{\"edges\":{\"+x\":27,\"+y\":29,\"+z\":30},\"id\":28,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":2,\"notes\":[2,7,10],\"root\":7,\"third\":10,\"neighbors\":[27,29,30],\"name\":\"Gm\",\"nameSharp\":\"Gm\",\"nameFlat\":\"Gm\"},{\"edges\":{\"-y\":28,\"-z\":25,\"-x\":20},\"id\":29,\"type\":\"chord\",\"voicing\":\"major\",\"third\":2,\"notes\":[2,10,5],\"root\":10,\"fifth\":5,\"neighbors\":[28,25,20],\"name\":\"Bb\",\"nameSharp\":\"A#\",\"nameFlat\":\"Bb\"},{\"edges\":{\"-x\":31,\"-y\":13,\"-z\":28},\"id\":30,\"type\":\"chord\",\"voicing\":\"major\",\"root\":3,\"notes\":[3,10,7],\"fifth\":10,\"third\":7,\"neighbors\":[31,13,28],\"name\":\"Eb\",\"nameSharp\":\"D#\",\"nameFlat\":\"Eb\"},{\"edges\":{\"+x\":30,\"+z\":33,\"+y\":21},\"id\":31,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":3,\"notes\":[3,10,6],\"fifth\":10,\"third\":6,\"neighbors\":[30,33,21],\"name\":\"Ebm\",\"nameSharp\":\"D#m\",\"nameFlat\":\"Ebm\"},{\"edges\":{\"+x\":17,\"+y\":33,\"+z\":34},\"id\":32,\"type\":\"chord\",\"voicing\":\"minor\",\"fifth\":3,\"notes\":[3,8,11],\"root\":8,\"third\":11,\"neighbors\":[17,33,34],\"name\":\"Abm\",\"nameSharp\":\"G#m\",\"nameFlat\":\"Abm\"},{\"edges\":{\"-y\":32,\"-z\":31,\"-x\":26},\"id\":33,\"type\":\"chord\",\"voicing\":\"major\",\"third\":3,\"notes\":[3,11,6],\"root\":11,\"fifth\":6,\"neighbors\":[32,31,26],\"name\":\"B\",\"nameSharp\":\"B\",\"nameFlat\":\"B\"},{\"edges\":{\"-x\":35,\"-y\":19,\"-z\":32},\"id\":34,\"type\":\"chord\",\"voicing\":\"major\",\"root\":4,\"notes\":[4,11,8],\"fifth\":11,\"third\":8,\"neighbors\":[35,19,32],\"name\":\"E\",\"nameSharp\":\"E\",\"nameFlat\":\"E\"},{\"edges\":{\"+x\":34,\"+z\":12,\"+y\":27},\"id\":35,\"type\":\"chord\",\"voicing\":\"minor\",\"root\":4,\"notes\":[4,11,7],\"fifth\":11,\"third\":7,\"neighbors\":[34,12,27],\"name\":\"Em\",\"nameSharp\":\"Em\",\"nameFlat\":\"Em\"}]");

// Freeze tonnetze
tonnetze.forEach(node => Object.freeze(node.edges));
Object.freeze(tonnetze);
console.log(`~=~ TONNETZE ~=~`);
console.log(tonnetze);

const noteNamesFlat  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const noteNamesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
Object.freeze(noteNamesFlat);
Object.freeze(noteNamesSharp);

//---------------------------------------------------------------
// Scale patterns
//---------------------------------------------------------------

const scalePatterns = 
{
  major:      [["+x"],["-x"],["+y"],["+z"],["+y","+x"],["+x","+x"]],
  minor:      [["+x"],["-x"],["-y"],["-z"],["-x","-x"],["+x","+x"]],
  pentaMajor: [["+x"],["+y"],["+z"],["+x","+x"]],
  pentaMinor: [["+x"],["-x"],["-z"],["-x","-x"],],
  blues:      [["-x"],["+x"],["-z"],["-z","+x"],["-z","-z"]]
}
Object.freeze(scalePatterns);

const scaleChordsPatterns = 
{
  major: 
  { 
    second:["-y","+z","-y"],
    third:["-z"],
    fourth:["-y","+z"],
    fifth:["-z","+y"],
    sixth:["-y"]
  },
  minor: 
  { 
    second:["+y","-z","+y"],
    third:["+z"],
    fourth:["+y","-z"],
    fifth:["+z","-y"],
    sixth:["+y"]
  }
}
Object.freeze(scaleChordsPatterns);


// Retrieve notes according to scale pattern
function getScaleNotes(root, scale)
{  
  let scaleNotes = [root];    
  scalePatterns[scale].forEach( pattern => 
  {
    scaleNotes.push(tonnetze[tonnetzeMove(root, pattern)].id);
  });
  return scaleNotes.sort((a,b) => a - b);
}

//---------------------------------------------------------------
// Chord patterns
//---------------------------------------------------------------

const chordPatterns = {
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

Object.freeze(chordPatterns.extensions);
Object.freeze(chordPatterns);

// Find scale major and minor chords
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

// Explore every chord pattern possibility with every note of the scale
function getAllScaleChords(root, scale)
{
  let scaleNotes = getScaleNotes(root, scale);
  let scaleChords = [];
  
  scaleNotes.forEach(note => scaleChords.push(getAllChordsOfNote(note, root, scale)[0]));
  
  return scaleChords;
}

// Get all possible chords of a note in a specific scale
function getAllChordsOfNote(note, root, scale)
{  
  let scaleNotes = getScaleNotes(root, scale);
  let noteChords = [];
  
  ["major","minor"].forEach(voicing => 
  {
    let voicingIsPresent = !chordPatterns[voicing].some(edge => !scaleNotes.includes(tonnetze[note].edges[edge]))

    if(voicingIsPresent) 
    {
      // Check for major extensions
      let extensions = [];
      for(let extension in chordPatterns.extensions)
      {        
        // Do the moves
        let pattern = chordPatterns.extensions[extension];  

        // Check the resulting note
        if(scaleNotes.includes(tonnetzeMove(note, pattern))) 
        { 
          extensions.push(extension); 
        }          
      }

      noteChords.push({root: note, voicing: voicing, extensions: extensions});        
    }
  });

  ["augmented", "diminished"].forEach( voicing => 
  {      
    let voicingIsPresent = !chordPatterns[voicing].some(pattern => 
    {
      // Check the resulting note
      return !scaleNotes.includes(tonnetzeMove(note, pattern));
    });    

    if(voicingIsPresent) 
    { 
      noteChords.push({root: note, voicing: voicing, extensions: []}); 
    }       
  });        

  // Add corresponding tonnetze id property to each chord
  noteChords.forEach(chord => 
  {
    chord.id = findChordTonnetzeId(chord.root, chord.voicing);
  });
  
  return noteChords;
}

function getScalesOfChord(chordNode)
{
  if(!(chordNode.hasOwnProperty("root") && chordNode.hasOwnProperty("voicing")))
  {
    console.error("Invalid chord node");
  }
  
  return getAllScaleChords(chordNode.root, chordNode.voicing)
  .filter(chord => chord.voicing !== "diminished")
  .map(function(chord) {return {root: chord.root, voicing: chord.voicing }});
}


//---------------------------------------------------------------
// Tonnetze utilities
//---------------------------------------------------------------

function getTonnetzeNodeEdges(node)
{  
  let edges = [];
  for(edge in tonnetze[node].edges) { edges.push(tonnetze[node].edges[edge]); }
  return edges;
}


function getEdgeNameOfNote(node, note)
{
  edgeName = "";
  for(nodeEdge in tonnetze[node].edges) 
  { 
    if(tonnetze[node].edges[nodeEdge] === note) 
    {
      edgeName = nodeEdge; 
    } 
  }  
  return edgeName;  
}

function oppositeEdge(edgeName)
{
  switch(edgeName)
  {
    case "+x" : return "-x";
    case "+y" : return "-y";
    case "+z" : return "-z";
    case "-x" : return "+x";
    case "-y" : return "+y";
    case "-z" : return "+z";
    default : console.error("Invalid edge name");
  }
}

function tonnetzeMove(originNode, movePattern) 
{
  let currentNode = originNode;
  movePattern.forEach(move => currentNode = tonnetze[currentNode].edges[move]);
  return currentNode;
}

function findChordTonnetzeId(iRoot, iVoicing)
{
  let wVoicing;

  if      (iVoicing === "diminished") { wVoicing = "minor"; }
  else if (iVoicing === "augmented")  { wVoicing = "major"; }
  else    { wVoicing = iVoicing; }

  return tonnetze.find(node => node.root === iRoot && node.voicing === wVoicing).id;
}

function findChordTonnetzeIdByName(iName)
{
  return tonnetze.find(node => node.name === iName && node.id >= 12).id;
}

function tonnetzeRandomChord() 
{
  return tonnetze[Math.floor(Math.random() * 24 + 12)];
}

function tonnetzeRandomNote() 
{
  return tonnetze[Math.floor(Math.random() * 12)];
}