customElements.define("polygam-note", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.index = -1;
    this.beat = -1;
    this.isSelected = false;

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .note-container
    { 
      height : 100%;
      border : dotted 1px silver;
      border-radius : 0.25em;
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.container = document.createElement("div");
    this.container.setAttribute("class","note-container");    
    shadow.appendChild(this.container);
         
  } // end of constructor

  placeNote(iBeat, iIndex)
  {
    this.beat = iBeat;
    this.index = iIndex;
  }
  
  click()
  {
    this.isSelected = !this.isSelected;
    this.container.style.background = this.isSelected ? "#DDD" : "none";
  }

  forceUpdate(iForcedState)
  {
    this.isSelected = iForcedState;
    this.container.style.background = this.isSelected ? "#DDD" : "none";
  }

});
