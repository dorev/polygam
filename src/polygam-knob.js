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
      display: grid;
      width: 100px;
      height: 100px;
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    
    this.container = document.createElement("div");
    this.container.setAttribute("class","knob-container");    
    shadow.appendChild(this.container);

    // Create SVG
    this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.svg.setAttribute("width", this.size);
    this.svg.setAttribute("height", this.size);
    this.container.appendChild(this.svg);
    
    this.knobBody = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.knobBody.setAttribute("cx", this.size/2);
    this.knobBody.setAttribute("cy", this.size/2);
    this.knobBody.setAttribute("r", this.size/2.2);
    this.knobBody.setAttribute("stroke","#000");
    this.knobBody.setAttribute("stroke-width",2);
    this.knobBody.setAttribute("fill","#0F0");
    this.svg.appendChild(this.knobBody);

    this.knobPointer = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.knobPointer.setAttribute("cx", this.size/2);
    this.knobPointer.setAttribute("cy", this.size/5);
    this.knobPointer.setAttribute("r", this.size/10);
    this.knobPointer.setAttribute("fill","#000");   
    this.svg.appendChild(this.knobPointer);


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
  knobChanged() {}  
  
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
    this.knobChanged(this.value);
  }

  
});