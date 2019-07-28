customElements.define("polygam-button", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;
    this.label = "null";
    this.value = false;

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`

    .button-container
    {   
      display: grid;
      margin : 0; 
      padding : 0;
      grid-template-rows: repeat(2, auto);
      place-items : center;
    }

    .button-svg
    {   
      grid-row : 1/2;
      width: ${this.size}px;
      height: ${this.size}px;
    }

    .button-icon
    {   
      grid-row : 1/2;
      width: ${this.size}px;
      height: ${this.size}px;
    }

    .button-label
    {   
      grid-row : 2/3;
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.container = document.createElement("div");
    this.container.setAttribute("class","button-container");    
    shadow.appendChild(this.container);

    this.button = document.createElement("div");
    this.button.setAttribute("class","button-svg");   

    // Create SVG
    let s = this.size;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.svg.setAttribute("width", s);
    this.svg.setAttribute("height", s);
    this.button.appendChild(this.svg);
    
    // Button body
    this.buttonBody = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.buttonBody.setAttribute("cx", s*0.5);
    this.buttonBody.setAttribute("cy", s*0.5);
    this.buttonBody.setAttribute("r", s/2.25);
    this.buttonBody.setAttribute("stroke","#000");
    this.buttonBody.setAttribute("stroke-width",s*0.02);
    this.buttonBody.setAttribute("fill","#FFF");
    this.svg.appendChild(this.buttonBody);

    this.container.appendChild(this.button);

    // Button label    
    this.buttonLabel = document.createElement("div");
    this.buttonLabel.setAttribute("class","button-label");    
    this.container.appendChild(this.buttonLabel);

    // Bind events
    this.addEventListener("click", (e) => 
    { 
      this.updateValue(!this.value);
      this.buttonEvent(this);
    });

    this.initButton();
         
  } // end of constructor

  // Callback
  buttonEvent() {}  

  initButton()
  {
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;    
    this.icon = this.hasAttribute("icon") ? this.getAttribute("icon") : this.icon;   
    this.label = this.hasAttribute("label") ? this.getAttribute("label") : this.label;   

    switch(this.icon)
    {
      default :
      case "null" :   
        break;

      case "sinePath" :        
      case "sawPath" :
      case "squarePath" :
      case "trianglePath" :
        this.svg.appendChild(newIcon(this.icon));
        break;
    }

    this.buttonLabel.innerHTML = this.label;
    this.buttonEvent(this);
  }

  forceUpdate(iForcedState)
  {
    this.updateValue(iForcedState);
  }

  updateValue(iValue)
  {
    this.value = iValue;
    this.buttonBody.style.strokeWidth = this.size * (iValue ? 0.06 : 0.02);
  }

  
});