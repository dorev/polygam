customElements.define("polygam-sequencer", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.progression = [];  // array of array of notes
    this.beats = [];
    this.currentBeat = -1;
    this.currentBar = 0;
    this.timeout;
    this.tempo = 120;
    this.isPlaying = false;
    this.isSelecting = false;
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`    
    .sequencer-container
    {
      margin : 0; padding : 0;
      display : grid;
      grid-template-rows : repeat(10, 1fr);
      grid-template-columns : 24px 2em repeat(16, 1fr);
      grid-auto-flow: column;
      place-items : stretch;
      grid-gap : 2px;
    }

    
    .sequencer-beat:nth-child(4n-2)
    {
      border-right: 1px solid silver;
    }

    .sequencer-beat:nth-child(13n)
    {
      border-right: none;
    }

    .sequencer-beat
    {
      grid-gap : 5px;
      margin : 0; padding : 0;
      place-self: stretch;
      grid-row : 1/11;
      display: grid;
      grid-template-rows : repeat(10, 1fr);
      place-items: stretch;
    }
    
    .sequencer-beat[highlight="true"]
    {
      background : #EEE;
    }
    
    .sequencer-beat[highlight="false"]
    {
      background : none;
    }

    .sequencer-note-label
    {
      place-self : stretch;
      min-height : 1em;
      font-family: "Polygam", sans-serif;
      font-size: 0.6em;
      color: black;
      text-align: center;
      margin: 0.4em;
    }

    .sequencer-reset-button
    {
      grid-column : 1/2;
      grid-row : 1/11;
      place-self : center;
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);
    this.container = document.createElement("div");
    this.container.setAttribute("class","sequencer-container");    
    shadow.appendChild(this.container);


    // Build sequencer
    for(let l = 0; l < 10; ++l)
    {
      // Beat setup
      let label = document.createElement("div");
      label.setAttribute("class", "sequencer-note-label");
      this.container.appendChild(label);
    }

    for(let b = 1; b < 17; ++b)
    {
      // Beat setup
      let beat = document.createElement("div");
      beat.setAttribute("class","sequencer-beat");   
      beat.setAttribute("highlight", "false");   
      
      // Notes setup
      for(let n = 0; n < 10; ++n)
      {
        let note;

        note = document.createElement("polygam-note");
        note.placeNote(b-1, 9-n);
        
        // Add mouse events
        note.addEventListener("mousedown",this.mousedown.bind(this));
        note.addEventListener("mouseover",this.mouseover.bind(this));

        beat.appendChild(note);
      }
      this.container.appendChild(beat);     
      
      // Fill beats structure
      this.beats.push(Array(10).fill(false));
    }
    // Add global mouseup event
    document.addEventListener("mouseup",this.mouseup.bind(this));

    this.noteLabels = this.container.querySelectorAll(".sequencer-note-label");    
    this.updateNoteLabels();

    // Setup reset button
    this.resetButton = document.createElement("div");
    this.resetButton.setAttribute("class", "sequencer-reset-button");
    this.resetButton.addEventListener("click", this.clearSequencer.bind(this));
    this.resetButton.appendChild(newIcon("trash"));
    this.container.appendChild(this.resetButton);

  } // end of constructor
  
  // Callback
  progHighlightChord(){}
  playerPlayNotes(){}

  play()
  {    
    this.isPlaying = true;
    
    // Set timeout until next beat (allows dynamic tempo change)
    this.timeout = setTimeout(()=>{ this.play(); }, 60000 / (this.tempo * 4) );   
    if(this.progression.length == 0) { return; }

    if(this.currentBeat === 15)
    {
      this.currentBar = (this.currentBar + 1) % this.progression.length;
      this.currentBeat = 0;
      this.updateNoteLabels();
    }
    else
    {
      ++this.currentBeat;
    }

    // Update beat highlighting
    let oldHighlight = this.container.querySelector("[highlight='true']");
    if(oldHighlight)    
    {
      oldHighlight.setAttribute("highlight", "false");
    }

    let newHighlight = this.container.querySelectorAll(`.sequencer-beat`)[this.currentBeat];
    newHighlight.setAttribute("highlight", "true");

    this.sendNotes();
    
    // Callback
    this.progHighlightChord(this.currentBar);
  }


  stop()
  {    
    if(!this.isPlaying) { return; }    
    this.isPlaying = false;    
    
    clearTimeout(this.timeout);
    this.currentBeat = -1;
    this.currentBar  = 0;      
    
    let currentHighlight = this.container.querySelector("[highlight='true']");
    if(currentHighlight)
    {
      currentHighlight.setAttribute("highlight", "false");
    }
  }


  setTempo(iTempo)
  {
    this.tempo = iTempo;
  }


  mousedown(e)
  {  
    this.isSelecting = true;    
    let note = e.target;
    note.click();    
    this.isAdding = note.isSelected;
    this.beats[note.beat][note.index] = note.isSelected;
  }
  

  mouseover(e)
  {
    let note = e.target;
    if(this.isSelecting && note.isSelected !== this.isAdding)
    {     
      note.click();
      this.beats[note.beat][note.index] = note.isSelected;
    }
  }
  

  mouseup(e)
  {
    this.isSelecting = false;
  }


  getNoteValue(iNoteIndex)
  {
    let octaveShift = Math.floor(iNoteIndex / 3) - 1;
    let baseNote = iNoteIndex % 3;
    return this.progression[this.currentBar][baseNote] + 12 * octaveShift;
  }


  sendNotes()
  {    
    let sequencerNotes = [];
    for(let i = 0; i < 10; ++i)
    {
      if(this.beats[this.currentBeat][i]) { sequencerNotes.push(i); }
    }
    if(sequencerNotes.length === 0) { return; }
    
    // Callback
    this.playerPlayNotes(sequencerNotes.map(n => this.getNoteValue(n)));
  }

  updateNoteLabels()
  {
    if(!this.progression.length) 
    {
      for(let i = 9; i >= 0; --i)
      {
        this.noteLabels[i].innerHTML = "";;
      }
       return; 
    }
    
    for(let i = 9; i >= 0; --i)
    {
      this.noteLabels[9-i].innerHTML = 
      ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"][this.progression[this.currentBar][i % 3] % 12];
    }
  }

  setProgression(iProgression)
  {
    if(this.isPlaying && iProgression.length > this.progression) 
    { 
      this.stop(); 
      this.progression = iProgression;
      this.play();
    }
    else
    {
      this.progression = iProgression;
    }
    this.updateNoteLabels();
  }

  clearSequencer()
  {
    for(let beat = 0; beat < 16; ++beat)
    {
      for(let note = 0; note < 10; ++note)
      {
        this.beats[beat][note] = false;
      }      
    }

    let allNotes = this.container.querySelectorAll("polygam-note");
    if(allNotes)
    {
      allNotes.forEach(note => { note.forceUpdate(false); });
    }
  }


  
  
});