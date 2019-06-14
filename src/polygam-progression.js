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
      place-items: center;
      grid-template-areas: "";
    }      

    .progression-chord-container
    {   
      
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
    // Adjust style 
    this.container.style.gridTemplateColumns = `repeat(${this.chords.length + 1}, 1fr)`;
    
    let gridAreas = "";
    for(let i = 1; i <= this.progression.length + 1; ++i)
    {
      gridAreas += `pos${i} `;
    }
    gridAreas.trim();
    console.log(gridAreas)
    this.container.style.gridTemplateAreas = `"${gridAreas}"`;   

    // Create chord element
    let newChord = document.createElement("polygam-chord");
    let chordContainer = document.createElement("progression-chord-container");

    chordContainer.setAttribute("style", `grid-area: pos${this.progression.length + 1}`);

    chordContainer.appendChild(newChord);
    
    // Add chord element
    this.container.appendChild(chordContainer);
    newChord.setChord(iChord);
    newChord.setPosition(this.chords.length);

    // Set callbacks
    newChord.chordChanged = this.chordChanged.bind(this);
    newChord.progressionChanged = this.chordManipulation.bind(this);

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

  chordManipulation(iChord, iEvent)
  {
    console.log(`chord ${iChord.position} asked ${iEvent}`);
    switch(iEvent)
    {
      case "swapLeft" : 
      
        if(iChord.position === 0) { break; }

        // Swap chords
        this.chords.splice(iChord.position - 1, 0, this.chords.splice(iChord.position,1)[0]); 
        this.progression.splice(iChord.position - 1, 0, this.progression.splice(iChord.position,1)[0]);        
        this.chords[iChord.position].parentNode.style.gridArea = `pos${iChord.position+1}`;
        this.chords[iChord.position-1].parentNode.style.gridArea = `pos${iChord.position}`;
        
        // Update chord inner values
        this.chords[iChord.position].position = iChord.position;
        this.chords[iChord.position-1].position = iChord.position-1;
        break;

      case "swapRight" : 

      break;

      case "delete" : 
      break;
    }
    
    // Callback
    this.progressionChanged(this);
  }

  highlightChord(iChordIndex)
  {

  }

});