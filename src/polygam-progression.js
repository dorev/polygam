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
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows:    9fr 1fr;
            width: 600px;
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


    addChord(iChord)
    {
        // Create element
        let newChord = document.createElement("polygam-chord");
        this.container.appendChild(newChord);
        newChord.setChord(iChord);

        // Set callback
        newChord.chordChanged = this.chordChanged;

        this.chords.push(newChord);
    }

    chordChanged(iChord)
    {
        console.log(`${iChord.name} has changed!`);
    }



});