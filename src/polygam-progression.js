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
    this.currentChordIndex = -1;
    
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
      position: relative;
      border : 1px dotted silver;
      overflow : auto;
    }      

    .progression-chord-container
    {   
      background : rgb(200,200,200);
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

  resizeProgression(iSize)
  {
    // Adjust style 
    this.container.style.gridTemplateColumns = `repeat(${iSize}, 1fr)`;

    let gridAreas = "";

    for(let i = 1; i <= iSize; ++i)
    {
      gridAreas += `pos${i} `;
    }

    gridAreas.trim();
    this.container.style.gridTemplateAreas = `"${gridAreas}"`;  
  }

  addChord(iChord)
  {    
    this.resizeProgression(this.progression.length + 1);

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
    this.progression.push(newChord.notes);

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
        if(iChord.position === this.progression.length - 1) { break; }

        // Swap chords
        this.chords.splice(iChord.position, 0, this.chords.splice(iChord.position+1,1)[0]); 
        this.progression.splice(iChord.position, 0, this.progression.splice(iChord.position+1,1)[0]);        
        this.chords[iChord.position+1].parentNode.style.gridArea = `pos${iChord.position+2}`;
        this.chords[iChord.position].parentNode.style.gridArea = `pos${iChord.position+1}`;
        
        // Update chord inner values
        this.chords[iChord.position].position = iChord.position;
        this.chords[iChord.position+1].position = iChord.position+1;
      break;

      case "delete" :       
        let nodeToRemove = this.chords[iChord.position].parentNode;
        nodeToRemove.parentNode.removeChild(nodeToRemove);
        this.chords.splice(iChord.position, 1); 
        this.progression.splice(iChord.position, 1); 

        for(let i = 0; i < this.progression.length; ++i)
        {
          this.chords[i].position = i;
          this.chords[i].parentNode.style.gridArea = `pos${ i + 1 }`;
        }

        this.resizeProgression(this.progression.length);              
        this.highlightChord(this.currentChordIndex, true)
        break;
    }
    
    // Callback
    this.progressionChanged(this);
  }

  highlightChord(iChordIndex, iForceUpdate = false)
  {
    if(iChordIndex === this.currentChordIndex && !iForceUpdate) { return; }
    this.currentChordIndex = iChordIndex;
    
    let highlightToRemove = this.container.querySelectorAll("progression-chord-container:not([background='rgb(200,200,200)'])");
    if(highlightToRemove)
    {
      highlightToRemove.forEach(element => element.style.background = "none");
    }

    if(iChordIndex < 0) { return; }
    this.chords[iChordIndex].parentNode.style.background = "rgb(200,200,200)";
  }

  clearProgression()
  {
    while(this.chords.length !== 0)
    {
      this.chordManipulation(this.chords[0], "delete");
    }

    // Callback
    this.progressionChanged(this);
  }

});