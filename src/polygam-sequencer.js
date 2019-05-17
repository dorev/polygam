/*

NOTES

the sequencer will contain the player (play/stop, volume, tempo)
will it have 7 or 10 notes? maybe 10 and the progression chord
is on the middle row and we can go above and below

*/

customElements.define("polygam-sequencer", class extends HTMLElement
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
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    
         
  } // end of constructor
  

  
});