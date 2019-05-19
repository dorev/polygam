/*
LOADING STUFF

// Wait for page to have loaded :
window.onload = function ...


// dynamically call js
function require(url, callback) 
{
  var e = document.createElement("script");
  e.src = url;
  e.type="text/javascript";
  e.addEventListener('load', callback);
  document.getElementsByTagName("head")[0].appendChild(e);
}

require("some.js", function() { 
   // Do this and that
});



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
      grid-template-rows: 100px 1fr auto auto 100px;
      place-items: stretch;
    }

    .app-graph
    {     
      place-self: stretch;
      grid-row : 1/2;
      background: green;
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
      background: red;
    }

    .app-sequencer
    {   
      place-self: stretch; 
      grid-row : 4/5;
      background: blue;
    }

    .app-oscillator
    {   
      place-self: stretch; 
      grid-row : 5/6;
      background: purple;
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
    this.graph = document.createElement("div");
    this.graph.setAttribute("class", "app-graph");
    this.container.appendChild(this.graph);

    // Create progression
    this.progression = document.createElement("polygam-progression");
    this.progression.setAttribute("class", "app-progression");
    this.container.appendChild(this.progression);

    this.progression.addChord({root:0, voicing:"major", octave:3});
    this.progression.addChord({root:0, voicing:"major", octave:3});
    this.progression.addChord({root:0, voicing:"major", octave:3});
    this.progression.addChord({root:0, voicing:"major", octave:3});

    // Create player
    this.player = document.createElement("polygam-player");
    this.player.setAttribute("class", "app-player");
    this.container.appendChild(this.player);

    // Create sequencer
    this.sequencer = document.createElement("polygam-sequencer");
    this.sequencer.setAttribute("class", "app-sequencer");
    this.container.appendChild(this.sequencer);

    // Create oscillator
    this.oscillator = document.createElement("div");
    this.oscillator.setAttribute("class", "app-oscillator");
    this.container.appendChild(this.oscillator);

    //--------------------------------------------------------
    // Connect elements
    //--------------------------------------------------------

    // Player calls sequencer
    this.player.sequencerPlay = this.sequencer.play;
    this.player.sequencerStop = this.sequencer.stop;

    // Sequencer calls player
    this.sequencer.playerPlayNotes = this.player.playNotes;

  } // end of constructor
  

  // Callback from progression
  progressionEvent(iProgression)
  {
    // When the progression changes
      // refresh the graph
      // update sequencer notes
  }

  // Callback from graph
  graphEvent()
  {

  }

  // Callback from sequencer
  sequencerEvent()
  {

  }

  // Callback from sequencer
  sequencerEvent()
  {

  }






});
