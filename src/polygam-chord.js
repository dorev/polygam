class PolygamChord extends HTMLElement
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
            grid-column-start : 1;
            grid-column-end   : 5;
            grid-row-start    : 1;
            grid-row-end      : 5;
            background: grey;
            border-radius: 5px;
        }
        
        .inversion-button-up
        {   
            grid-column-start : 1;
            grid-column-end   : 4;
            grid-row-start    : 5;
            grid-row-end      : 6;
            background: grey;
            border-radius: 5px;
        }
        
        .inversion-label
        {   
            grid-column-start : 1;
            grid-column-end   : 4;
            grid-row-start    : 6;
            grid-row-end      : 8;
            background: grey;
            border-radius: 5px;
        }
        
        .inversion-button-down
        {   
            grid-column-start : 1;
            grid-column-end   : 4;
            grid-row-start    : 8;
            grid-row-end      : 9;
            background: grey;
            border-radius: 5px;
        }
        
        .octave
        {   
            grid-column-start : 5;
            grid-column-end   : 7;
            grid-row-start    : 1;
            grid-row-end      : 5;
            background: grey;
            border-radius: 5px;
        }
        
        .octave-button-up
        {   
            grid-column-start : 4;
            grid-column-end   : 7;
            grid-row-start    : 5;
            grid-row-end      : 6;
            background: grey;
            border-radius: 5px;
        }
        
        .octave-label
        {   
            grid-column-start : 4;
            grid-column-end   : 7;
            grid-row-start    : 6;
            grid-row-end      : 8;
            background: grey;
            border-radius: 5px;
        }
        
        .octave-button-down
        {   
            grid-column-start : 4;
            grid-column-end   : 7;
            grid-row-start    : 8;
            grid-row-end      : 9;
            background: grey;
            border-radius: 5px;
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
        this.invButtonUp    .addEventListener("click", this.inversionUp); 
        this.invButtonDown  .addEventListener("click", this.inversionDown);
        this.octButtonUp    .addEventListener("click", this.octaveUp);
        this.octButtonDown  .addEventListener("click", this.octaveDown);

        //setChord(properties);

    } // end of constructor

    // Callbacks
    chordChanged(){}

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
           && Number.isInteger(properties.octave)
           && properties.octave >= 0
           && properties.octave <= 9)
        )
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
        // Retarget customElement base
        let that = this.parentNode.parentNode.host;

        // Check if inversion is possible
        if(that.notes[0] > 96)
        {
            console.error("Chord to high to invert");
            return;
        }

        // Increase inversion value
        that.inversion = that.inversion === that.maxInversion ? 1 : that.inversion + 1;

        // Rotate chord notes   
        that.notes.push(that.notes.shift() + 12);
        
        // Update octave value
        that.octave = that.octaveOf(that.getBass());
        that.octaveName.innerHTML = that.octave;
        
        // Callback
        that.chordChanged(that);

        that.updateChordName();
    }

    inversionDown()
    {
        // Retarget customElement base
        let that = this.parentNode.parentNode.host;

        // Check if inversion is possible
        if(that.notes[that.notes.length - 1] < 12)
        {
            console.error("Chord to low to invert");
            return;
        }

        // Decrease inversion value
        that.inversion = that.inversion === 1 ? that.maxInversion : that.inversion - 1;

        // Rotate chord notes   
        that.notes.unshift(that.notes.pop() - 12);
        
        // Update octave value
        that.octave = that.octaveOf(that.getBass());
        that.octaveName.innerHTML = that.octave;

        // Callback
        that.chordChanged(that);

        that.updateChordName();
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
        // Retarget customElement base
        let that = this.parentNode.parentNode.host;

        // Check no note busts octave 9
        if(that.octaveOf(that.getSoprano() + 12) > 9)
        {
            console.error("Chords note to high to increase of an octave");
            return;
        }

        // Update octave value
        that.octave++;
        that.octaveName.innerHTML = that.octave;

        // Increase pitch by 12
        that.notes = that.notes.map(n => n + 12);

        // Callback
        that.chordChanged(that);
    }

    octaveDown()
    {
        // Retarget customElement base
        let that = this.parentNode.parentNode.host;

        // Check no note busts octave 0
        if(that.octaveOf(that.getBass() - 12)< 0)
        {
            console.error("Chords note to low to decrease of an octave");
            return;
        }

        // Update octave value
        that.octave--;
        that.octaveName.innerHTML = that.octave;

        // Increase pitch by 12
        that.notes = that.notes.map(n => n - 12);

        // Callback
        that.chordChanged(that);
    }

    // Utilities
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