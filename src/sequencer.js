//-------------------------------------------------
// Custom sequencer element
//-------------------------------------------------
customElements.define("polygam-sequencer", class extends HTMLElement
{
  constructor()
  {
    super();
    
    this.currentBar = -1;
    this.currentBeat = -1;
    this.noteDuration = this.hasAttribute("note-duration") ? this.getAttribute("note-duration") : "4n";
    this.seqLength = this.hasAttribute("seq-length") ? Number(this.getAttribute("seq-length")) : 4;
    this.seqHeight = this.hasAttribute("seq-height") ? Number(this.getAttribute("seq-height")) : 4;
    
    // Structure holding the whole score
    this.score = { "beats" : [], "bars" : [] };    
    for(let i = 0; i < this.seqLength; ++i)
    {
      this.score.beats.push(Array(this.seqHeight).fill(0));
    }        
    /* this.score expected structure
    { 
      "beats" : [
        [0,0,0,0],  // note activation states of beat 0
        [0,0,0,0],  // beat 1
        [0,0,0,0],  // ...
        [0,0,0,0]
      ]
      "bars" : [
        ["C4","D#4","G4","C5"], // notes with octave (sharps only, no flats) of bar 0
        ["G4","B4","D5","F5"]   // bar 1
      ]                         // ...
    }
    */
      
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    {
    style.textContent =`
    .polygam-sequencer-song 
    {
      display: flex;      
      position: relative;
      height: 100%;
      width: 100%;
      border: 0.05em solid #999;
      border-radius : 0.25em;
      padding:  0.2em;
      background-image: linear-gradient(45deg, #444, #333);
    }

    .polygam-sequencer-bar 
    {
      position: absolute;
      display: flex;
      border-radius : inherit;
      padding:  0.05em;
      top : 0.1em;
      bottom : 0.1em;
      left : 0.1em;
      right : 0.1em;
      background-image: linear-gradient(135deg, #333, #555);
    }

    .polygam-sequencer-beat 
    {
      display: flex;
      flex-direction: column-reverse;
      width: 100%;
      margin: 0 0.1em 0 0.1em;
      border-radius : inherit;
    }

    .polygam-sequencer-note
    {  
      display: flex;
      flex-direction: column;
      height: 95%;
      width: 95%;
      border: 0.05em solid #aaa;
      border-radius : inherit;
      margin: 0.1em;
      background-image: linear-gradient(225deg, #333, #555);
      opacity: 0.3;
    }

    .polygam-sequencer-note.active
    {  
      background-image: linear-gradient(45deg, #888, #aaa);
      opacity: 0.5;
    }

    .polygam-sequencer-note:hover
    {  
      opacity: 0.9;
    }

    .polygam-sequencer-note.root
    {  
      background : #eee;
    }

    .polygam-sequencer-beat.active .polygam-sequencer-note
    {  
      opacity: 1;
    }

    .polygam-sequencer-note.active.C  
    {  
      background-image: linear-gradient(#FF3333, #FF8E33);
    }

    .polygam-sequencer-note.active.Cs  
    {  
      background-image: linear-gradient(#FFB833, #E4FF33);
    }

    .polygam-sequencer-note.active.D  
    {  
      background-image: linear-gradient(#E4FF33, #94FF33);
    }

    .polygam-sequencer-note.active.Ds  
    {  
      background-image: linear-gradient(#94FF33, #33FF71);
    }

    .polygam-sequencer-note.active.E  
    {  
      background-image: linear-gradient(#33FF71, #33FFC0);
    }

    .polygam-sequencer-note.active.F  
    {  
      background-image: linear-gradient(#33FFC0, #33FFAA);
    }

    .polygam-sequencer-note.active.Fs  
    {  
      background-image: linear-gradient(#33FFAA, #33F6FF);
    }

    .polygam-sequencer-note.active.G 
    {  
      background-image: linear-gradient(#33F6FF, #337CFF);
    }

    .polygam-sequencer-note.active.Gs 
    {  
      background-image: linear-gradient(#337CFF, #4833FF);
    }

    .polygam-sequencer-note.active.A 
    {  
      background-image: linear-gradient(#4833FF, #A733FF);
    }

    .polygam-sequencer-note.active.As 
    {  
      background-image: linear-gradient(#A733FF, #FF33E1);
    }

    .polygam-sequencer-note.active.B 
    {  
      background-image: linear-gradient(#FF33E1, #FF3333);
    }      
    `;  
    }
    
    //--------------------------------------------------------
    // Construct default custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    
    this.song = document.createElement("div");
    this.song.setAttribute("class","polygam-sequencer-song");    
    shadow.appendChild(this.song);      
  }
  
  removeBar(barToRemove)
  {  
    this.stop();
    
    if(barToRemove >= 0 && barToRemove < this.song.children.length)
    {
      this.song.removeChild(this.song.children[barToRemove]);
    }
    
    // Rename bar id of all subsequent notes
    for(let barIndex = barToRemove; barIndex < this.song.children.length; ++barIndex)
    {
      let beatCount = this.getBarDOM(bar).children.length;
      for(let beatIndex = 0; beatIndex < beatCount; ++beatIndex)
      {
        let noteCount = this.getBeatDOM(barIndex, beatIndex).children.length;
        for(let noteIndex = 0; noteIndex < noteCount; ++noteIndex)
        {
          this.getNoteDOM(barIndex, beatIndex, noteIndex).setAttribute("bar",barIndex);
        }
      }
    }
    
    // Remove from score
    this.score.bars.splice(barToRemove,1);
    
  }
  
  stop()
  {
    if(this.currentBeat < 0 || this.CurrentBar < 0) { return; }
    this.getBeatDOM(this.currentBar,this.currentBeat).setAttribute("class", "polygam-sequencer-beat"); 
    this.currentBeat = -1;
    this.currentBar = -1;
  }
  
  nextBeat()
  {  
    // Skip clearing last beat when song starts
    if(this.currentBar >= 0)
    {
      this.getBeatDOM(this.currentBar,this.currentBeat).setAttribute("class", "polygam-sequencer-beat");      
    }
    else
    {
      ++this.currentBar;
    }    
        
    // If we reached the end of the bar
    if(++this.currentBeat === this.getBarDOM(this.currentBar).children.length)
    {
      this.currentBeat = 0;
      
      // If we reached the end of the song
      if(++this.currentBar === this.song.children.length)
      {
        this.currentBar = 0;
      }  
    } 
      
    this.getBeatDOM(this.currentBar,this.currentBeat).setAttribute("class", "polygam-sequencer-beat active"); 
    this.bringBarOnTop(this.currentBar);   
  }
  
    
  bringBarOnTop(barIndex)
  {
    for(let i = 0; i < this.score.bars.length; ++i)
    {
      this.getBarDOM(i).style.zIndex = (i === barIndex ? 1 : 0);
    }
  }

  appendBar(notes)
  { 
    // Stop the sequencer to avoid unpredictable state
    this.stop(); 
    
    let bar = document.createElement("div");
    bar.setAttribute("class", "polygam-sequencer-bar");
    
    for(let beatIndex = 0; beatIndex < this.seqLength; ++beatIndex)
    {               
      bar.appendChild(this.buildBeatDOM(this.song.children.length, beatIndex, notes));
    }
    
    // Update DOM and score
    this.song.appendChild(bar);     
    this.score.bars.push(notes);
  }
  
  buildBeatDOM(barIndex, beatIndex, notes)
  {
    // Create DOM element
    let beat = document.createElement("div");
    beat.setAttribute("class", "polygam-sequencer-beat");

    for(let i = 0; i < this.seqHeight; ++i)
    {
      beat.appendChild(this.buildNoteDOM(barIndex, beatIndex, i, notes[i]));
    }
    
    return beat;
  }  
  
  buildNoteDOM(barIndex, beatIndex, noteIndex, noteName ="")
  {
    // Create DOM element
    let note = document.createElement("div");    
    note.setAttribute("class", "polygam-sequencer-note");     
    note.setAttribute("bar", barIndex); 
    note.setAttribute("beat", beatIndex); 
    note.setAttribute("index", noteIndex);    
    if(noteName.length) {note.setAttribute("note", noteName.replace(/s|S/,"#"));}  
    
    // Mouse and touch event listeners
    note.addEventListener("click", this.noteClick.bind(this));
    note.addEventListener("touch", this.noteClick.bind(this));
    
    return note;
  }
  
  getBarDOM(barIndex)
  {
    return this.song.children[barIndex];
  }
  
  getBeatDOM(barIndex, beatIndex)
  {
    return this.song
      .children[barIndex]
      .children[beatIndex];
  }
  
  getNoteDOM(barIndex, beatIndex, noteIndex)
  {
    return this.song
      .children[barIndex]
      .children[beatIndex]
      .children[noteIndex];
  }
  
  noteClick(e)
  {
    let beatIndex = Number(e.target.getAttribute("beat"));
    let noteIndex = Number(e.target.getAttribute("index"));    
    let noteActivation = /polygam-sequencer-note active .*/.test(e.target.getAttribute("class"));
    
    this.setNoteActivation(beatIndex, noteIndex, !noteActivation);
  }
  
  setNoteActivation(beatIndex, noteIndex, noteActivation)
  {    
    // Update DOM
    for(let barIndex = 0; barIndex < this.score.bars.length; ++barIndex)
    {
      let noteToEdit = this.getNoteDOM(barIndex, beatIndex, noteIndex);
      
      if(noteActivation)
      {
        if(noteToEdit.hasAttribute("note"))
        {
          noteToEdit.setAttribute
          ("class", "polygam-sequencer-note active " + noteToEdit.getAttribute("note").match(/[a-gA-G|s|S]{1,2}/)[0]);
        }
        else
        {
          noteToEdit.setAttribute("class", "polygam-sequencer-note active");
        } 
      } 
      else
      {
        noteToEdit.setAttribute("class", "polygam-sequencer-note");
      }      
    }
    
    // Update score
    this.score.beats[beatIndex][noteIndex] = noteActivation;
  }
  
  getCurrentNotes()
  {
    if(this.currentBar < 0 || this.currentBeat < 0) { return [];}
    let result = [];
    
    for(let noteIndex = 0; noteIndex < this.seqHeight; ++noteIndex)
    {
      if(this.score.beats[this.currentBeat][noteIndex] 
        && this.score.bars[this.currentBar][noteIndex] != undefined) 
      { 
        result.push(this.score.bars[this.currentBar][noteIndex]);
      }
    }
    
    return result;
  } 
  
  setBarNotes(barIndex, notes) 
  {
    this.score.bars[barIndex] = notes;
    
    // Update DOM
    let bar = this.getBarDOM(barIndex);
    
    for(let beatIndex = 0; beatIndex < this.seqLength; ++beatIndex)
    {               
      for(let noteIndex = 0; noteIndex < this.seqHeight; ++noteIndex)
      {
        let note = this.getNoteDOM(barIndex, beatIndex, noteIndex);
        if(noteIndex >= notes.length) { continue; }
        if(/[a-gA-G|s|S]{1,2}/.test(notes[noteIndex]))
        {
          note.setAttribute("note", notes[noteIndex].replace(/s|S/,"#"));  
        }      
      }
    }
  } 
  
  setBeats(beats)
  {
    for(let beatIndex = 0; beatIndex < this.seqLength; ++beatIndex)
    {
      for(let noteIndex = 0; noteIndex < this.seqHeight; ++noteIndex)
      {
        if(beatIndex >= beats.length 
           || noteIndex >= beats[beatIndex].length 
           || beats[beatIndex][noteIndex] === undefined) { continue; }
        
        this.setNoteActivation(beatIndex, noteIndex, beats[beatIndex][noteIndex]);
      }
    }
  }  

});


//-------------------------------------------------
// Demo
//-------------------------------------------------

let seq = document.querySelector("polygam-sequencer");
seq.appendBar(["C#4","E4","G#4","B4","E5","G#5","B5"]);
seq.appendBar(["F#3","A3","C4","F#4","A4","C5","F#5"]);
seq.setBeats([[1],[,1],[,,1],[,1,,1],[],[,,,,1,,1],[,,,1,,1]]);

let synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
let tempo = 256;
let sequencerInterval;
let sequencerRunning = false;

function startSequencer()
{
  if(sequencerRunning) { return; }
  sequencerRunning = true;
  
  sequencerInterval = setInterval(()=>
  {
    seq.nextBeat();
    let notes = seq.getCurrentNotes();
    synth.triggerAttackRelease(notes, seq.noteDuration);  
    if(notes.length) {console.log(notes);}
  },60000/tempo);  
}

function stopSequencer()
{
  clearInterval(sequencerInterval);
  sequencerRunning = false;
  seq.stop();
}