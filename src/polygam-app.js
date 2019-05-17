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
      place-self: stretch;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows:    repeat(8, 1fr);
      background: darkgrey;
      place-items: stretch;
    }

    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  



    this.init(); 
         
  } // end of constructor
  
  init()
  {
    // create graph    
    // create progression
    // create sequencer
    // create oscillator
  }

  // Callback from progression
  progressionEvent(iProgression)
  {
    // When the progression changes
      // refresh the graph
      // update sequencer notes
      // 

  }

  // Callback from graph
  graphEvent()
  {

  }

  // Callback from sequencer
  sequencerEvent()
  {

  }




});

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
