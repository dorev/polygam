/*
// CUTE CSS!!
https://cssfx.dev/
*/

customElements.define("polygam-app", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    

    this.prevTranspose = 0;
    this.prevDetune = 0;
    this.prevFilters = 
    [
      {
        lowpass : 20000,
        highpass : 20
      },
      {
        lowpass : 20000,
        highpass : 20
      }
    ];

    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .app-container
    {   
      margin : 0; padding : 0;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: auto; 
      grid-template-rows: repeat(6, auto);
      place-items: stretch;
    }

    .app-graph
    {     
      place-self: stretch;
      grid-row : 1/2;
    }

    .app-progression
    {      
      place-self: stretch;
      grid-row : 2/3;
    }

    .app-player
    {   
      place-self: stretch; 
      grid-row : 3/4;
    }

    .app-sequencer
    {   
      place-self: stretch; 
      grid-row : 4/5;
    }

    .app-oscillator0
    {   
      place-self: stretch; 
      grid-row : 5/6;
    }

    .app-oscillator1
    {   
      place-self: stretch; 
      grid-row : 6/7;
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.container = document.createElement("div");
    this.container.setAttribute("class","app-container");    
    shadow.appendChild(this.container);

    // Create graph    
    this.graph = document.createElement("polygam-graph");
    this.graph.setAttribute("class", "app-graph");
    this.container.appendChild(this.graph);

    // Create progression
    this.progression = document.createElement("polygam-progression");
    this.progression.setAttribute("class", "app-progression");
    this.container.appendChild(this.progression);

    // Create player
    this.player = document.createElement("polygam-player");
    this.player.setAttribute("class", "app-player");
    this.container.appendChild(this.player);

    // Create sequencer
    this.sequencer = document.createElement("polygam-sequencer");
    this.sequencer.setAttribute("class", "app-sequencer");
    this.container.appendChild(this.sequencer);

    // Create oscillator
    this.oscillator0 = document.createElement("polygam-oscillator");
    this.oscillator0.setAttribute("class", "app-oscillator0");
    this.oscillator0.oscId = 0;
    this.container.appendChild(this.oscillator0);

    // Create oscillator
    this.oscillator1 = document.createElement("polygam-oscillator");
    this.oscillator1.setAttribute("class", "app-oscillator1");
    this.oscillator1.oscId = 1;
    this.container.appendChild(this.oscillator1);
    

    //--------------------------------------------------------
    // Connect elements
    //--------------------------------------------------------
    
    // Sequencer calls player
    this.sequencer.playerPlayNotes = this.player.playNotes.bind(this.player);
    
    // Sequencer calls progression
    this.sequencer.progHighlightChord = this.progression.highlightChord.bind(this.progression);
    
    // Player calls main app
    this.player.playerEvent  = this.playerEvent.bind(this);
    
    // Progression calls main app
    this.progression.progressionChanged = this.progressionChanged.bind(this);

    // Graph calls main app
    this.graph.progressionChanged = this.progressionChanged.bind(this);

    this.oscillator0.oscillatorEvent = this.oscillatorEvent.bind(this);
    this.oscillator1.oscillatorEvent = this.oscillatorEvent.bind(this);

  } // end of constructor

  progressionChanged(caller)
  {
    switch(caller.name)
    {
      case "progression" :
        // Update progression in sequencer    
        this.sequencer.setProgression(caller.progression);
        this.graph.setProgression(caller.chords);
        break;

      case "graph" :
        let lastChord = caller.progression[caller.progression.length - 1];
        this.progression.addChord({root:lastChord.root, voicing:lastChord.voicing, octave:4});
        break;
    }
  }

  playerEvent(iEvent)
  {
    switch(iEvent.type)
    {
      case "play" :
        this.sequencer.play();
        break;

      case "stop" :
        this.sequencer.stop();
        this.progression.highlightChord(-1);
        break;

      case "tempo" :
        this.sequencer.setTempo(iEvent.value);
        break;
    }

  }

  oscillatorEvent(iProperty, iValue, iOscId = 0)
  {
    switch(iProperty)
    {
      case "waveform" :
          this.player.setOscillatorProperties({ type: iValue }, iOscId);
        break;
        
      case "detune" :
          this.prevDetune = iValue;
          this.player.setOscillatorProperties({ detune: this.prevDetune + this.prevTranspose }, iOscId);
        break;
          
      case "transpose" :
        
        this.prevTranspose = (iValue >= 0 ? Math.floor(iValue) : Math.ceil(iValue)) * 100;
        this.player.setOscillatorProperties({ detune: this.prevDetune + this.prevTranspose }, iOscId);

        break;

      case "lowpass":
          this.prevFilters[iOscId].lowpass = iValue;
          this.player.setFilterProperties({ frequency: this.prevFilters[iOscId].lowpass }, iOscId, "lowpass");
        break;
      
      case "highpass" :
          this.prevFilters[iOscId].highpass = iValue;
          this.player.setFilterProperties({ frequency: this.prevFilters[iOscId].highpass }, iOscId, "highpass");
        break;
    }
  }

});
