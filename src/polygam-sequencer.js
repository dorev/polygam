customElements.define("polygam-sequencer", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.bars = [[24,28,33],[24,28,33]];  // array of array of notes
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
      grid-template-columns : 2em repeat(16, 1fr);
      grid-template-rows : repeat(10, 1fr);
      place-items : stretch;
      min-height : 100px;
      grid-auto-flow: column;
    }

    .sequencer-beat
    {
      margin : 0; padding : 0;
      grid-row : 1/11;
      display: grid;
      place-items: stretch;
      grid-template-rows : repeat(10, 1fr);
    }
    
    .sequencer-beat[highlight="true"]
    {
      background : #DDD;
    }
    
    .sequencer-beat[highlight="false"]
    {
      background : none;
    }
    .sequencer-note-label
    {
      place-self : stretch;
      border : solid 1px lightgrey;
      min-height : 1em;
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


  } // end of constructor
  

  play()
  {    
    this.isPlaying = true;
    
    // Set timeout until next beat (allows dynamic tempo change)
    this.timeout = setTimeout(()=>{ this.play(); }, 60000 / (this.tempo * 4) );
    
    if(this.currentBeat === 15)
    {
      this.currentBar = (this.currentBar + 1) % this.bars.length;
      this.currentBeat = 0;
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
  }


  stop()
  {    
    this.isPlaying = false;
    clearTimeout(this.timeout);
    this.currentBeat = -1;
    this.currentBar  = 0;    
    this.container.querySelector("[highlight='true']").setAttribute("highlight", "false");
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
    return this.bars[this.currentBar][baseNote] + 12 * octaveShift;
  }

  sendNotes()
  {
    let sequencerNotes = [];
    for(let i = 0; i < 10; ++i)
    {
      if(this.beats[this.currentBeat][i]) { sequencerNotes.push(i); }
    }
    if(sequencerNotes.length === 0) { return; }
    console.log("sending notes");
    this.playerPlayNotes(sequencerNotes.map(n => this.getNoteValue(n)));
  }

  
});