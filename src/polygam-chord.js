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
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`        
    .chord-container
    {   
      margin : 0; padding : 0;
      place-self: center;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows:    repeat(8, 1fr);
      width: 100px;
      height: 200px;
      background: darkgrey;
      place-items: stretch;
    }
    
    .chord-name
    {   
      grid-column : 1/5;
      grid-row    : 1/5;
      background: grey;
    }
    
    .inversion-button-up
    {   
      grid-column : 1/4;
      grid-row    : 5/6;
      background: grey;
    }
    
    .inversion-label
    {   
      grid-column : 1/4;
      grid-row    : 6/8;
      background: grey;
    }
    
    .inversion-button-down
    {   
      grid-column : 1/4;
      grid-row    : 8/9;
      background: grey;
    }
    
    .octave
    {   
      grid-column : 5/7;
      grid-row    : 1/5;
      background: grey;
    }
    
    .octave-button-up
    {   
      grid-column : 4/7;
      grid-row    : 5/6;
      background: grey;
    }
    
    .octave-label
    {   
      grid-column : 4/7;
      grid-row    : 6/8;
      background: grey;
    }
    
    .octave-button-down
    {   
      grid-column : 4/7;
      grid-row    : 8/9;
      background: grey;
    }
    `;  
      
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.name         = "";
    this.voicing      = "";
    this.root         = 0;
    this.octave       = 0;
    this.inversion    = 0;
    this.maxInversion = 0;
    this.notes        = [];
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  

    this.container     = document.createElement("div");
    this.chordName     = document.createElement("div");
    this.invButtonUp   = document.createElement("div");
    this.invLabel      = document.createElement("div");
    this.invButtonDown = document.createElement("div");        
    this.octaveName    = document.createElement("div");
    this.octButtonUp   = document.createElement("div");
    this.octLabel      = document.createElement("div");
    this.octButtonDown = document.createElement("div");


    this.container     .setAttribute("class","chord-container");
    this.chordName     .setAttribute("class","chord-name");  
    this.invButtonUp   .setAttribute("class","inversion-button-up"); 
    this.invLabel      .setAttribute("class","inversion-label"); 
    this.invButtonDown .setAttribute("class","inversion-button-down"); 
    this.octaveName    .setAttribute("class","octave");  
    this.octButtonUp   .setAttribute("class","octave-button-up"); 
    this.octLabel      .setAttribute("class","octave-label"); 
    this.octButtonDown .setAttribute("class","octave-button-down"); 
    
    this.container.appendChild(this.chordName);
    this.container.appendChild(this.invButtonUp);
    this.container.appendChild(this.invLabel);
    this.container.appendChild(this.invButtonDown);
    this.container.appendChild(this.octaveName);
    this.container.appendChild(this.octButtonUp);
    this.container.appendChild(this.octLabel);
    this.container.appendChild(this.octButtonDown);
    shadow.appendChild(this.container);

    this.invLabel.innerHTML = "INV";
    this.octLabel.innerHTML = "OCT";
    this.invButtonDown.innerHTML = "-";
    this.octButtonDown.innerHTML = "-";
    this.invButtonUp.innerHTML = "+";
    this.octButtonUp.innerHTML = "+";

    //--------------------------------------------------------
    // Setup events
    //--------------------------------------------------------
    this.invButtonUp    .addEventListener("click", this.inversionUp.bind(this)); 
    this.invButtonDown  .addEventListener("click", this.inversionDown.bind(this));
    this.octButtonUp    .addEventListener("click", this.octaveUp.bind(this));
    this.octButtonDown  .addEventListener("click", this.octaveDown.bind(this));

    //setChord(properties);

  } // end of constructor

  // Callbacks
  chordChanged() {}

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

    this.maxInversion = 3;

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
    if(this.notes[0] > 96)
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
    this.octaveName.innerHTML = this.octave;
    
    // Callback
    this.chordChanged(this);

    this.updateChordName();
  }

  inversionDown()
  {
    // Check if inversion is possible
    if(this.notes[this.notes.length - 1] < 12)
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
    this.octaveName.innerHTML = this.octave;

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
    this.octaveName.innerHTML = this.octave;
  }

  octaveUp()
  {
    // Check no note busts octave 9
    if(this.octaveOf(this.getSoprano() + 12) > 9)
    {
      console.error("Chords note to high to increase of an octave");
      return;
    }

    // Update octave value
    this.octave++;
    this.octaveName.innerHTML = this.octave;

    // Increase pitch by 12
    this.notes = this.notes.map(n => n + 12);

    // Callback
    this.chordChanged(this);
  }

  octaveDown()
  {
    // Check no note busts octave 0
    if(this.octaveOf(this.getBass() - 12)< 0)
    {
      console.error("Chords note to low to decrease of an octave");
      return;
    }

    // Update octave value
    this.octave--;
    this.octaveName.innerHTML = this.octave;

    // Increase pitch by 12
    this.notes = this.notes.map(n => n - 12);

    // Callback
    this.chordChanged(this);
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
});