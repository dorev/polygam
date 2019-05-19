customElements.define("polygam-progression",class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.chords = [];
    
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`        
    .progression-container
    {   
      margin : 0; padding : 0;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: auto;
      grid-template-rows: auto;
      height: 250px;
      background: orange;
      place-items: center;
    }

    `;  
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.container = document.createElement("div");
    this.container.setAttribute("class","progression-container");    
    shadow.appendChild(this.container);
        
  } // end of constructor

  // Callback
  progressionEvent()
  {
  }

  addChord(iChord)
  {
    // Create chord element
    let newChord = document.createElement("polygam-chord");
    
    // Adjust style 
    this.container.style.gridTemplateColumns = `repeat(${this.chords.length + 1}, 1fr)`;

    // Add chord element
    this.container.appendChild(newChord);
    newChord.setChord(iChord);

    // Set callback
    newChord.chordChanged = this.chordChanged.bind(this);

    this.chords.push(newChord);
  }

  chordChanged(iChord)
  {
    this.progressionEvent(this);
  }



});