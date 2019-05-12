class PolygamChord extends HTMLElement
{            
    constructor()
    {
        super();        
        
        //--------------------------------------------------------
        // CSS style
        //--------------------------------------------------------
        let style = document.createElement('style');
        {
        style.textContent =`
        
        .chord-container
        {   
            grid-gap: 2px;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows:    repeat(8, 1fr);
        }
        
        .chord-name
        {   
            grid-column-start : 1;
            grid-column-end   : 5;
            grid-row-start    : 1;
            grid-row-end      : 5;
        }
        
        .inversion-button-up
        {   
            grid-column-start : 1;
            grid-column-end   : 4;
            grid-row-start    : 5;
            grid-row-end      : 6;
        }
        
        .inversion-label
        {   
            grid-column-start : 1;
            grid-column-end   : 4;
            grid-row-start    : 6;
            grid-row-end      : 8;
        }
        
        .inversion-button-down
        {   
            grid-column-start : 1;
            grid-column-end   : 4;
            grid-row-start    : 8;
            grid-row-end      : 9;
        }
        
        .octave
        {   
            grid-column-start : 5;
            grid-column-end   : 7;
            grid-row-start    : 1;
            grid-row-end      : 5;
        }
        
        .octave-button-up
        {   
            grid-column-start : 4;
            grid-column-end   : 7;
            grid-row-start    : 5;
            grid-row-end      : 6;
        }
        
        .octave-label
        {   
            grid-column-start : 4;
            grid-column-end   : 7;
            grid-row-start    : 6;
            grid-row-end      : 8;
        }
        
        .octave-button-down
        {   
            grid-column-start : 4;
            grid-column-end   : 7;
            grid-row-start    : 8;
            grid-row-end      : 9;
        }
        `;  
        }
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
        
        this.chordName     = document.createElement("div");
        this.invButtonUp   = document.createElement("div");
        this.invLabel      = document.createElement("div");
        this.invButtonDown = document.createElement("div");        
        this.octaveName    = document.createElement("div");
        this.octButtonup   = document.createElement("div");
        this.octLabel      = document.createElement("div");
        this.octButtonDown = document.createElement("div");

        this.chordName     .setAttribute("class","chord-name");  
        this.invButtonUp   .setAttribute("class","inversion-button-up"); 
        this.invLabel      .setAttribute("class","inversion-label"); 
        this.invButtonDown .setAttribute("class","inversion-button-down"); 
        this.octaveName    .setAttribute("class","octave");  
        this.octButtonup   .setAttribute("class","octave-button-up"); 
        this.octLabel      .setAttribute("class","octave-label"); 
        this.octButtonDown .setAttribute("class","octave-button-down"); 
        
        shadow.appendChild(chordName);
        shadow.appendChild(invButtonUp);
        shadow.appendChild(invLabel);
        shadow.appendChild(invButtonDown);
        shadow.appendChild(octave);
        shadow.appendChild(octButtonup);
        shadow.appendChild(octLabel);
        shadow.appendChild(octButtonDown);

        this.invLabel.innerHTML = "INV";
        this.octLabel.innerHTML = "OCT";

        //--------------------------------------------------------
        // Setup events
        //--------------------------------------------------------
        this.invButtonUp    .addEventListener("click", inversionUp); 
        this.invButtonDown  .addEventListener("click", inversionDown);
        this.octButtonup    .addEventListener("click", octaveUp);
        this.octButtonDown  .addEventListener("click", octaveDown);

    } // end of constructor

    // Mediator callbacks
    updateProgression(){}
    updateGraph(){}

    setChord(properties)
    {
        if(
           //Check root
           !( properties.hasOwnProperty("root")
           && Number.isInteger(properties.root)
           // Check voicing
           && properties.hasOwnProperty("voicing")
           && (properties.voicing === "major" || properties.voicing === "minor")
           // Check octave
           && properties.hasOwnProperty("octave") 
           && Number.isInteger(properties.octave))
        )
        {
            console.error("Invalid chord set, check properties");
        }

        this.root    = properties.root;
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
        // Increase inversion value
        this.inversion = this.inversion === this.maxInversion ? 1 : this.inversion + 1;

        // Rotate chord notes   
        this.notes.push(this.notes.shift());
        
        // Validate bass octave
        if(this.octaveOf(this.getBass()) != this.octave)
        {
            // Shift chord one octave down            
            notes = notes.map(n => n - 12);
        }
        
        this.updateChordName();
    }

    inversionDown()
    {
        // Decrease inversion value
        this.inversion = this.inversion === 0 ? this.maxInversion : this.inversion - 1;

        // Rotate chord notes   
        this.notes.unshift(this.notes.pop());
        
        // Validate bass octave
        if(this.octaveOf(this.getBass()) != this.octave)
        {
            // Shift chord one octave up            
            notes = notes.map(n => n + 12);
        }

        this.updateChordName();
    }

    updateChordName()
    {
        let notesName = ["C","C#","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
        this.name = `${notesName[this.notes[0] % 12]} ${this.voicing}`;

        if(this.inversion != 1)
        {
            this.name += `/${notesName[this.notes[this.inversion-1] % 12]}`;
        }

        this.chordName.innerHTML = this.name;
    }

    octaveUp()
    {
        // Check no note busts octave 9
        if(this.octaveOf(this.getSoprano() + 12) > 9)
        {
            console.err("Chords note to high to increase of an octave")
            return;
        }

        // Update octave value
        this.octave++;
        this.octaveName.innerHTML = this.octave;

        // Increase pitch by 12
        notes = notes.map(n => n + 12);
    }

    octaveDown()
    {
        // Check no note busts octave 0
        if(this.octaveOf(this.getBass() - 12) < 0)
        {
            console.err("Chords note to low to decrease of an octave")
            return;
        }

        // Update octave value
        this.octave--;
        this.octaveName.innerHTML = this.octave;

        // Increase pitch by 12
        notes = notes.map(n => n - 12);
    }

    octaveOf(noteNumber)
    {
        return Math.floor(noteNumber / 12);
    }

    getBass()
    {        
        return Math.min.apply(null, this.notes);
    }

    getSoprano()
    {
        return Math.max.apply(null, this.notes);
    }


};

customElements.define("polygam-chord", PolygamChord);