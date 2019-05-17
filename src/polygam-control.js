customElements.define("polygam-control", class extends HTMLElement
{          
  
  /*
  like the HTMLElement input, polygam-control is registry
  of various control types with different properties :
  - play/stop button
  - knob
  - anything else...
  */


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