customElements.define("polygam-progression",class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`        
    .progression-container
    {   
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
    // Custom element members
    //--------------------------------------------------------    
    this.chords = [];
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  

    this.container = document.createElement("div");
    this.container.setAttribute("class","progression-container");    
    shadow.appendChild(this.container);

    //--------------------------------------------------------
    // Setup events
    //--------------------------------------------------------


  } // end of constructor

  // Callbacks
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
    console.log(`${iChord.name} has changed!`);
    this.progressionEvent(this);
  }



});