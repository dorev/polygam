customElements.define("polygam-knob", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;    
    this.profile = this.hasAttribute("profile") ? this.getAttribute("profile") : "equalrange";    
    this.knobActive = false;
    this.mouseY = 0;
    this.initialMouseY = 0;
    this.initialRotation = 180;
    this.rotation = 0;
    this.value = 0;
    this.min;
    this.max;
    this.label = "null";
    this.updateFunc = () => {};

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`

    .knob-container
    {   
      display: grid;
      margin : 0; 
      padding : 0;
      grid-template-rows: repeat(3, auto);
      place-items : center;
    }

    .knob-svg-container
    {   
      grid-row : 1/2;
      width: ${this.size}px;
      height: ${this.size}px;
    }

    .knob-label
    {   
      grid-row : 2/3;
    }

    .knob-value
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
    this.container.setAttribute("class","knob-container");    
    shadow.appendChild(this.container);

    this.knob = document.createElement("div");
    this.knob.setAttribute("class","knob-svg-container");   

    // Create SVG
    let s = this.size;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.svg.setAttribute("width", s);
    this.svg.setAttribute("height", s);
    this.knob.appendChild(this.svg);
    
    // Knob body
    this.knobBody = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.knobBody.setAttribute("cx", s*0.5);
    this.knobBody.setAttribute("cy", s*0.5);
    this.knobBody.setAttribute("r", s/2.25);
    this.knobBody.setAttribute("stroke","#000");
    this.knobBody.setAttribute("stroke-width",s*0.025);
    this.knobBody.setAttribute("fill","#FFF");
    this.svg.appendChild(this.knobBody);

    // Knob cursor
    this.knobCursor = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.knobCursor.setAttribute("cx", s*0.5);
    this.knobCursor.setAttribute("cy", s*0.25);
    this.knobCursor.setAttribute("r", s*0.1);
    this.knobCursor.setAttribute("fill","#000");   
    this.svg.appendChild(this.knobCursor);

    this.container.appendChild(this.knob);

    // Knob label    
    this.knobLabel = document.createElement("div");
    this.knobLabel.setAttribute("class","knob-label");    
    this.container.appendChild(this.knobLabel);

    // Knob value    
    this.knobValue = document.createElement("div");
    this.knobValue.setAttribute("class","knob-value");    
    this.container.appendChild(this.knobValue);

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

    this.initKnob();
         
  } // end of constructor

  // Callback
  knobEvent() {}  

  initKnob(iInitialPosition)
  {
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;    
    this.profile = this.hasAttribute("profile") ? this.getAttribute("profile") : "equalrange";   
    this.label = this.hasAttribute("label") ? this.getAttribute("label") : this.label;   

    switch(this.profile)
    {
      default :
      case "equalrange" :        
        this.min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 0;  
        this.max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 100;

        this.updateFunc = () => 
        { 
          let value =  (this.max - this.min) * this.rotationPercentage() + this.min;
          if(value < this.min) return this.min;
          if(value > this.max) return this.max;
          return value;
        }
        break;

        case "10log2" :
          this.min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : -80;
          this.max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 0;
          this.updateFunc = () => 
          {
            let value = 10 * Math.log2(this.rotationPercentage());
            if(value < this.min) return this.min;
            if(value > this.max) return this.max;
            return value;
          }
          break;

        case "antilog" :
          this.min = this.hasAttribute("min") ? parseInt(this.getAttribute("min")) : 20;
          this.max = this.hasAttribute("max") ? parseInt(this.getAttribute("max")) : 20000;
          this.updateFunc = () => 
          {
            let value = Math.pow(10, (3 * this.rotationPercentage() - 2 )) * 2000;
            if(value < this.min) return this.min;
            if(value > this.max) return this.max;
            return value;
          }
          break;
    }

    this.knobLabel.innerHTML = this.label;

    if(iInitialPosition != undefined)
    {
      this.initialRotation = iInitialPosition * 300 - 150;
      this.initialMouseY = 0;
      this.mouseY = 0;
      this.rotate();
    }

    this.updateValue();
    this.knobEvent(this);
  }
  
  rotate()
  {
    let newRotation = (this.initialRotation + this.initialMouseY - this.mouseY); 
    if(newRotation < -150)
    {
      this.rotation = -150;
      this.svg.style.transform = `rotate(-150deg)`;
      this.value = this.min;
      this.knobValue.innerHTML = this.formatLabel(this.value);
      this.knobEvent(this);
    }
    else if(newRotation > 150)
    {
      this.rotation = 150;
      this.svg.style.transform = `rotate(150deg)`;
      this.value = this.max;
      this.knobValue.innerHTML = this.formatLabel(this.value);
      this.knobEvent(this);
    }
    else
    {
      this.svg.style.transform = `rotate(${newRotation}deg)`;
      this.rotation = newRotation;
      this.updateValue();
    }
  }

  rotationPercentage()
  {
    let rotation = (this.rotation + 150) / 300;
    if(rotation < 0) return 0;
    if(rotation > 1) return 1;
    return rotation;
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