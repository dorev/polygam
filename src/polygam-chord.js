customElements.define("polygam-chord", class extends HTMLElement
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

        //--------------------------------------------------------
        // Custom element members
        //--------------------------------------------------------    
        this.name       = "";
        this.voicing    = "";
        this.root       = 0;
        this.octave     = 0;
        this.inversion  = 0;
        this.notes      = [];
        
        //--------------------------------------------------------
        // Construct custom element
        //--------------------------------------------------------
        let shadow = this.attachShadow({mode: 'open'});  
        shadow.appendChild(style);  
        
        this.chordName     = document.createElement("div");
        this.invButtonUp   = document.createElement("div");
        this.invLabel      = document.createElement("div");
        this.invButtonDown = document.createElement("div");        
        this.octave        = document.createElement("div");
        this.octButtonup   = document.createElement("div");
        this.invLabel      = document.createElement("div");
        this.octButtonDown = document.createElement("div");

        this.chordName     .setAttribute("class","chord-name");  
        this.invButtonUp   .setAttribute("class","inversion-button-up"); 
        this.invLabel      .setAttribute("class","inversion-label"); 
        this.invButtonDown .setAttribute("class","inversion-button-down"); 
        this.octave        .setAttribute("class","octave");  
        this.octButtonup   .setAttribute("class","octave-button-up"); 
        this.invLabel      .setAttribute("class","octave-label"); 
        this.octButtonDown .setAttribute("class","octave-button-down"); 
        
        shadow.appendChild(chordName);
        shadow.appendChild(invButtonUp);
        shadow.appendChild(invLabel);
        shadow.appendChild(invButtonDown);
        shadow.appendChild(octave);
        shadow.appendChild(octButtonup);
        shadow.appendChild(invLabel);
        shadow.appendChild(octButtonDown);

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
        if(!(properties.hasOwnProperty("root") &&
             properties.hasOwnProperty("name") &&
             properties.hasOwnProperty("voicing") &&
             properties.hasOwnProperty("octave")))
        {
            console.error("Invalid chord set");
        }

        this.root    = properties.root;
        this.name    = properties.name;
        this.voicing = properties.voicing;
        this.octave  = properties.octave;

        // calc notes

    }

    inversionUp()
    {     
        // update inversion value
        // rotate chord notes   
        // validate bass octave
        // update chord name
    }

    inversionDown()
    {
        
    }

    octaveUp()
    {
        // check no note busts octave 9
        // update octave value
        // increase pitch by 12
    }

    octaveDown()
    {
        
    }


});