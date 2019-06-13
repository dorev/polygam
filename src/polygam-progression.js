customElements.define("polygam-progression",class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.chords = [];
    this.progression = [];
    this.name = "progression";
    
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
  progressionChanged(){}

  addChord(iChord)
  {
    // Create chord element
    let newChord = document.createElement("polygam-chord");
    
    // Adjust style 
    this.container.style.gridTemplateColumns = `repeat(${this.chords.length + 1}, 1fr)`;

    // Add chord element
    this.container.appendChild(newChord);
    newChord.setChord(iChord);
    newChord.setPosition(this.chords.length);

    // Set callback
    newChord.chordChanged = this.chordChanged.bind(this);

    this.chords.push(newChord);
    this.progression.push(newChord.notes)

    // Callback
    this.progressionChanged(this);
  }

  chordChanged(iChord)
  {
    this.progression[iChord.position] = iChord.notes;
    
    // Callback
    this.progressionChanged(this);
  }

  highlightChord(iChordIndex)
  {

  }

});