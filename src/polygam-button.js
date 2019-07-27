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
      grid-template-rows: repeat(3, auto);
      place-items : center;
    }

    .button-svg-container
    {   
      grid-row : 1/2;
      width: ${this.size}px;
      height: ${this.size}px;
    }

    .button-label
    {   
      grid-row : 2/3;
    }

    .button-value
    {   
      grid-row : 3/4;
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
    this.button.setAttribute("class","button-svg-container");   

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

    // Knob label    
    this.buttonLabel = document.createElement("div");
    this.buttonLabel.setAttribute("class","button-label");    
    this.container.appendChild(this.buttonLabel);

    // Bind events
    this.addEventListener("mousedown", (e) => 
    { 
      this.buttonActive = true;
    });

    addEventListener("mouseup", () => 
    { 
      if(this.buttonActive) { this.knobActive = false; }
    });

    this.initButton();
         
  } // end of constructor

  // Callback
  buttonEvent() {}  

  initButton(iInitialPosition)
  {
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;    
    this.icon = this.hasAttribute("icon") ? this.getAttribute("icon") : "null";   
    this.label = this.hasAttribute("label") ? this.getAttribute("label") : this.label;   

    switch(this.icon)
    {
      default :
      case "null" :   
        break;

      case "sine" :
        break;

      case "saw" :
        break;

      case "square" :
        break;

      case "triangle" :
        break;
    }

    this.knobLabel.innerHTML = this.label;
    this.buttonEvent(this);
  }

  formatLabel(iValue)
  {
    return iValue;
  }

  updateValue()
  {
    this.value = this.updateFunc();
    this.knobValue.innerHTML = this.formatLabel(this.value);
    // Callback
    this.knobEvent(this);
  }

  
});