customElements.define("polygam-sequencer", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.progression = [];  // array of array of notes
    this.currentBeat = -1;  //
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .sequencer-container
    {
      margin : 0; padding : 0;
      display : grid;
      grid-template-rows : auto auto;
    }
    .sequencer-player-container
    {
      margin : 0; padding : 0;
    }

    .sequencer-seq-container
    {
      margin : 0; padding : 0;
      display : grid;
      grid-template-columns : 2em repeat(16, 1fr);
      grid-template-rows : auto;
      place-items : stretch;
    }

    .sequencer-beat
    {
      margin : 0; padding : 0;
      grid-template-rows : repeat(10, 1fr);
    }

    .sequencer-beat:nth-child(2n)
    {
      background : #DDD;
    }
    
    .sequencer-beat[highlight=true]
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

    // Player container
    this.player = document.createElement("polygam-player");
    this.player.setAttribute("class","sequencer-player-container");    
    this.container.appendChild(this.player);

    // Sequencer container
    this.sequencer = document.createElement("div");
    this.sequencer.setAttribute("class","sequencer-seq-container");    
    this.container.appendChild(this.sequencer);

    // Notes
    for(let b = 0; b < 17; ++b)
    {
      let beat = document.createElement("div");
      beat.setAttribute("class","sequencer-beat");    
      
      let noteClass = b ? "sequencer-note" : "sequencer-note-label";
      
      for(let n = 0; n < 10; ++n)
      {
        let note = document.createElement("div");
        note.setAttribute("class",noteClass);    
        beat.appendChild(note);
      }
      
      this.sequencer.appendChild(beat);
    }




    
         
  } // end of constructor
  

  
});