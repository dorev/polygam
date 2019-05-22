customElements.define("polygam-knob", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;    
    this.knobActive = false;
    this.mouseY = 0;
    this.initialMouseY = 0;
    this.initialRotation = 180;
    this.rotation = 0;
    this.value = 50;

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .knob-container
    {   
      margin : 0; padding : 0;
      display: grid;
      width: ${this.size}px;
      height: ${this.size}px;
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.container = document.createElement("div");
    this.container.setAttribute("class","knob-container");    
    shadow.appendChild(this.container);

    // Create SVG
    let s = this.size;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.svg.setAttribute("width", s);
    this.svg.setAttribute("height", s);
    this.container.appendChild(this.svg);
    
    // Knob body
    this.knobBody = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.knobBody.setAttribute("cx", s*0.5);
    this.knobBody.setAttribute("cy", s*0.5);
    this.knobBody.setAttribute("r", s/2.25);
    this.knobBody.setAttribute("stroke","#000");
    this.knobBody.setAttribute("stroke-width",s*0.05);
    this.knobBody.setAttribute("fill","#0F0");
    this.svg.appendChild(this.knobBody);

    // Knob cursor
    this.knobCursor = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.knobCursor.setAttribute("cx", s*0.5);
    this.knobCursor.setAttribute("cy", s*0.2);
    this.knobCursor.setAttribute("r", s*0.1);
    this.knobCursor.setAttribute("fill","#000");   
    this.svg.appendChild(this.knobCursor);


    // Bind events
    this.addEventListener("mousedown", (e) => 
    { 
      this.knobActive = true;
      this.initialMouseY = e.clientY;
      this.initialRotation = this.rotation; 
    });

    addEventListener("mouseup", () => 
    { 
      if(this.knobActive) { this.knobActive = false; }
    });

    addEventListener("mousemove", (e) => 
    {
      if(this.knobActive) 
      { 
        this.mouseY = e.clientY;
        this.rotate();
      }  
    });   
         
  } // end of constructor

  // Callback
  knobEvent() {}  
  
  rotate()
  {
    let newRotation = (this.initialRotation + this.initialMouseY - this.mouseY); 
    if(newRotation > -151 && newRotation < 151)
    {
      this.svg.style.transform = `rotate(${newRotation}deg)`;
      this.rotation = newRotation;
      this.updateValue();
    }
  }

  updateValue()
  {
    this.value = (this.rotation + 150) / 3;
    
    // Callback
    this.knobEvent(this);
  }

  
});