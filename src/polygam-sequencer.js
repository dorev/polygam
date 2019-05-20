customElements.define("polygam-sequencer", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.bars = [];  // array of array of notes
    this.beats = [];
    this.currentBeat = 0;
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
      grid-template-columns : 2em repeat(16, 1fr) 1em;
      grid-template-rows : auto;
      place-items : stretch;
      min-height : 100px;
    }

    .sequencer-beat
    {
      margin : 0; padding : 0;
      grid-template-rows : repeat(10, 1fr);
    }
    
    .sequencer-beat[highlight="true"]
    {
      background : #DDD;
    }
    
    .sequencer-beat[highlight="false"]
    {
      background : transparent;
    }

    .sequencer-beat .sequencer-note, .sequencer-beat .sequencer-note-label
    {
      height : 1em;
      margin : 0.1em;
      place-self : stretch;
    }
    
    /* Root note */
    .sequencer-note:nth-child(3n+1)
    {
      background : grey;
    }
    
    .sequencer-note
    {
      background : darkgrey;
    }

    .sequencer-note-label
    {
      background : lightgrey;
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
    for(let b = 0; b < 17; ++b)
    {
      let beat = document.createElement("div");
      beat.setAttribute("class","sequencer-beat");   
      beat.setAttribute("highlight", "false");   
      
      let noteClass = b ? "sequencer-note" : "sequencer-note-label";
      
      for(let n = 0; n < 10; ++n)
      {
        let note = document.createElement("polygam-note");
        note.index = 9 - n;
        note.beat = b - 1;
        
        // Add mouse events
        note.addEventListener("mousedown",this.mousedown.bind(this));
        note.addEventListener("mouseover",this.mouseover.bind(this));

        beat.appendChild(note);
      }
      this.container.appendChild(beat);     
      
      // Fill beats structure
      if(b) { this.beats.push(Array(10).fill(null)); }
    }
    
    // Add global mouseup event
    document.addEventListener("mouseup",this.mouseup.bind(this));

    // Adding "Space" as play-stop shortcut
    document.addEventListener("keypress", (event) => 
    {
      if(event.key !== " ") { return; }
      if(this.isPlaying) { this.stop(); }
      else               { this.play(); }
    });
         
  } // end of constructor
  
  play()
  {    
    this.isPlaying = true;
    
    // Set timeout until next beat (allows dynamic tempo change)
    this.timeout = setTimeout(()=>{ this.play(); }, 60000 / (this.tempo * 4) );
    
    if(this.currentBeat === 16)
    {
      this.currentBar = (this.currentBar + 1) % this.bars.length;
      this.currentBeat = 1;
    }
    else
    {
      ++this.currentBeat;
    }

    let oldHighlight = this.container.querySelector("[highlight='true']");
    if(oldHighlight)    
    {
      oldHighlight.setAttribute("highlight", "false");
    }

    let newHighlight = this.container.querySelector(`.sequencer-beat:nth-child(${this.currentBeat + 1})`);
    newHighlight.setAttribute("highlight", "true");

    this.playerPlayNotes(this.bars[this.currentBeat]);
  }

  stop()
  {    
    this.isPlaying = false;
    clearTimeout(this.timeout);
    this.currentBeat = 0;
    this.currentBar  = 0;    
    this.container.querySelector("[highlight='true']").setAttribute("highlight", "false");
  }

  setTempo(iTempo)
  {
    this.tempo = iTempo;
  }

  getNodeIndex(iNode)
  {
    for (var i = 0; (iNode = iNode.previousSibling); ++i);
    return i;
  }

  mousedown(e)
  {  
    this.isSelecting = true;
    
    let note = e.target;
    note.click();    
    this.isAdding = note.isSelected;
    this.noteActivation(note.beat, note.index)
  }
  
  mouseover(e)
  {
    let note = e.target;
    
    if(this.isSelecting && note.isSelected !== this.isAdding)
    {     
      note.click();
      this.noteActivation(note.beat, note.index)
    }
  }
  
  mouseup(e)
  {
    this.isSelecting = false;
  }

  noteActivation(iBeat, iNote)
  {
    console.log("UPDATING SEQUENCER BEATS!");
  }


  
});