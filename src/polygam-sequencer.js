customElements.define("polygam-sequencer", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.bars = [];  // array of array of notes
    this.currentBeat = 0;
    this.currentBar = 0;
    this.timeout;
    this.tempo = 120;
    
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
    }

    .sequencer-beat
    {
      margin : 0; padding : 0;
      grid-template-rows : repeat(10, 1fr);
    }
    
    .sequencer-beat[highlight=0]
    {
      background : #DDD;
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

    // Notes
    for(let b = 0; b < 17; ++b)
    {
      let beat = document.createElement("div");
      beat.setAttribute("class","sequencer-beat");    
      
      let noteClass = b ? "sequencer-note" : "sequencer-note-label";
      
      for(let n = 0; n < 10; ++n)
      {
        let note = document.createElement("div");
        note.setAttribute("class", noteClass);    
        beat.appendChild(note);
      }
      
      this.container.appendChild(beat);
    }
         
  } // end of constructor
  
  play()
  {
    console.log("start sequencer!")    
    this.timeout = setTimeout(()=>{ this.play(); }, this.tempo * 4 / 60000);

    
    if(this.currentBeat === 17)
    {
      this.currentBar = (this.currentBar + 1) % this.bars.length;
      this.currentBeat = 0;
    }
    else
    {
      ++this.currentBeat;
    }

    let oldHighlight = this.container.querySelector(`[highlight=1]`);
    oldHighlight.setAttribute("highlight", 0);

    let newHighlight = this.container.querySelector(`.beat:nth-child(${this.currentBeat + 2})`);
    newHighlight.setAttribute("highlight", 1);
    
    this.playerPlayNotes(this.bars[this.currentBeat]);
  }

  stop()
  {
    console.log("stop sequencer!")
    clearTimeout(this.timeout);
    this.currentBeat = 0;
    this.currentBar  = 0;
  }

  setTempo(iTempo)
  {
    console.log("tempo set in sequencer!")
    this.tempo = iTempo;
  }

  


  
});