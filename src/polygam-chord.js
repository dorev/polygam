/*
REWORK:

remove OCT display, label and controls
remove INV label and integrate controls around the chord name

inversion +/- will be the way to access the various octaves 

! will need a way to limit the range if the sequencer has more octaves

*/

customElements.define("polygam-chord",class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.name         = "";
    this.root         = -1;
    this.voicing      = "";
    this.notes        = [];
    this.octave       = -1;
    this.position     = -1;
    this.inversion    = -1;
    this.maxInversion = 3;
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`        
    
    div
    {
      text-align: center;
    }
    
    
    .chord-container
    {   
      margin : 0; padding : 0;
      display: grid;
      padding: 0.1em;
      grid-gap: 0.2em;
      grid-template-rows:    repeat(6, auto);
      grid-template-column:    repeat(3, 1fr);
      min-width: 5.5em;
      place-items: stretch;
      border: dotted silver 1px;
      border-radius: 5px;
    }
    
    .inversion-button-up
    {   
      grid-row    : 1/3;
      grid-column : 1/4;
    }

    .chord-name
    {   
      grid-row    : 2/5;
      grid-column : 1/4;
      font-size : 2em;
      place-self: center;
      font-family: "Polygam", sans-serif;
    }    
    
    .inversion-button-down
    {   
      grid-row    : 4/6;
      grid-column : 1/4;
    }
    
    .swap-left-button
    {   
      grid-row    : 6/7;
      grid-column : 1/2;
    }
    
    .swap-right-button
    {   
      grid-row    : 6/7;
      grid-column : 3/4;
    }
    
    .delete-button
    {   
      grid-row    : 6/7;
      grid-column : 2/3;
    }
    
    `;  
      
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  

    this.container     = document.createElement("div");
    this.chordName     = document.createElement("div");
    this.invButtonUp   = document.createElement("div");
    this.invButtonDown = document.createElement("div");
    this.swapLeftButton  = document.createElement("div");
    this.swapRightButton = document.createElement("div");
    this.deleteButton    = document.createElement("div");


    this.container     .setAttribute("class","chord-container");
    this.chordName     .setAttribute("class","chord-name");  
    this.invButtonUp   .setAttribute("class","inversion-button-up"); 
    this.invButtonDown .setAttribute("class","inversion-button-down"); 
    this.swapLeftButton  .setAttribute("class","swap-left-button");
    this.swapRightButton .setAttribute("class","swap-right-button");
    this.deleteButton    .setAttribute("class","delete-button");
    
    this.container.appendChild(this.chordName);
    this.container.appendChild(this.invButtonUp);
    this.container.appendChild(this.invButtonDown);
    this.container.appendChild(this.swapLeftButton);
    this.container.appendChild(this.swapRightButton);
    this.container.appendChild(this.deleteButton);
    shadow.appendChild(this.container);

    this.invButtonDown.innerHTML = "-";
    this.invButtonUp.innerHTML = "+";
    this.swapLeftButton.innerHTML = "<";
    this.swapRightButton.innerHTML = ">";

    this.deleteButton.appendChild(newIcon("trash", 0.8));

    //--------------------------------------------------------
    // Setup events
    //--------------------------------------------------------
    
    this.container      .addEventListener("mouseover", this.mouseOver.bind(this)); 
    this.container      .addEventListener("mouseout", this.mouseOut.bind(this)); 
    this.invButtonUp    .addEventListener("click", this.inversionUp.bind(this)); 
    this.invButtonDown  .addEventListener("click", this.inversionDown.bind(this));
    this.swapLeftButton .addEventListener("click", this.swapLeft.bind(this)); 
    this.swapRightButton.addEventListener("click", this.swapRight.bind(this));
    this.deleteButton   .addEventListener("click", this.delete.bind(this)); 
    this.deleteButton.style.visibility = "hidden";

    //setChord(properties);

  } // end of constructor

  mouseOver()
  {
    this.deleteButton.style.visibility = "visible";
  }

  mouseOut()
  {
    this.deleteButton.style.visibility = "hidden";
  }

  setChord(properties)
  {
    if
    (!(
      //Check root
        properties.hasOwnProperty("root")
      && Number.isInteger(properties.root)
      // Check voicing
      && properties.hasOwnProperty("voicing")
      && (properties.voicing === "major" || properties.voicing === "minor")
      // Check octave
      && properties.hasOwnProperty("octave") 
      && Number.isInteger(properties.octave)
      && properties.octave >= 0
      && properties.octave <= 9
    ))
    {
      console.error("Invalid chord set, check properties");
    }

    if(properties.hasOwnProperty("inversion")
        && Number.isInteger(properties.inversion))
    {
      this.inversion = properties.inversion;
    }
    else
    {
      this.inversion = 1;
    }

    this.root    = properties.root % 12;
    this.voicing = properties.voicing;
    this.octave  = properties.octave;

    // Calculate notes
    // Add root
    this.notes.push(this.root + 12 * this.octave);

    // Add third
    switch(this.voicing)
    {
      case "major" : this.notes.push(this.notes[0] + 4); break;
      case "minor" : this.notes.push(this.notes[0] + 3); break;
      default : console.err("Invalid voicing"); return;
    }        

    // Add fifth
    this.notes.push(this.notes[0] + 7);

    // Iterate to reach correct inversion
    for(let inv = 1; inv < this.inversion; ++inv)
    {
      inversionUp();
    }

    this.updateChordName();
  }

  inversionUp()
  {     
    // Check if inversion is possible
    if(this.notes[0] > 84)
    {
      console.error("Chord to high to invert");
      return;
    }

    // Increase inversion value
    this.inversion = this.inversion === this.maxInversion ? 1 : this.inversion + 1;

    // Rotate chord notes   
    this.notes.push(this.notes.shift() + 12);
    
    // Update octave value
    this.octave = this.octaveOf(this.getBass());
    
    // Callback
    this.chordChanged(this);

    this.updateChordName();
  }

  inversionDown()
  {
    // Check if inversion is possible
    if(this.notes[this.notes.length - 1] < 24)
    {
      console.error("Chord to low to invert");
      return;
    }

    // Decrease inversion value
    this.inversion = this.inversion === 1 ? this.maxInversion : this.inversion - 1;

    // Rotate chord notes   
    this.notes.unshift(this.notes.pop() - 12);
    
    // Update octave value
    this.octave = this.octaveOf(this.getBass());

    // Callback
    this.chordChanged(this);

    this.updateChordName();
  }

  updateChordName()
  {
    let notesName = ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
    this.name = `${notesName[this.root]}${this.voicing === "major" ? "" : "m"}`;

    if(this.inversion != 1)
    {
      this.name += `/${notesName[this.notes[0] % 12]}`;
    }

    this.chordName.innerHTML = this.name;
  }


  swapLeft()
  {
    // Callback
    this.progressionChanged(this, "swapLeft");
  }

  swapRight()
  {
    // Callback
    this.progressionChanged(this, "swapRight");
  }

  delete()
  {
    // Callback
    this.progressionChanged(this, "delete");
  }
  

  // Utilities  
  octaveOf(iNoteNumber) 
  {
    return Math.floor(iNoteNumber / 12);
  }

  getBass()
  {        
    return Math.min.apply(null, this.notes);
  }

  getSoprano()
  {
    return Math.max.apply(null, this.notes);
  }

  setPosition(iPosition)
  {
    this.position = iPosition;
  }

});