// Example in html: <simple-knob name="volume" rotation=0></simple-knob> 

customElements.define("simple-knob", class extends HTMLElement
{            
  constructor()
  {
    super();
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .knob 
    {
      position: relative;
      width: 6em; height: 6em;
      border-radius: 100%;
      background: radial-gradient(#ccc, #444);
      transform: rotate(0deg);
    }
    .knob:after
    {
      content: '';
      position: absolute;
      width: 0.3em; height: 0.6em;
      left: 2.85em; top: 1em;
      border-radius: 25%;
      background: #eee;
    }
    .knob:before
    {
      content: '';
      position: absolute;
      width: 5em; height: 5em;
      left: 0.5em; top: 0.5em;
      border-radius: 100%;
      background: linear-gradient(#555, #777);
    }
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.knobBody = document.createElement('div');
    this.knobBody.setAttribute("class","knob");
    shadow.appendChild(this.knobBody);
    
    this.knobActive = false;
    this.mouseY = 0;
    this.initialMouseY = 0;
    this.initialRotation = this.getAttribute("rotation");
        
    //--------------------------------------------------------
    // Mouse events
    //--------------------------------------------------------
    this.addEventListener("mousedown", (e) => 
    { 
      this.knobActive = true;
      this.initialMouseY = e.clientY;
      this.initialRotation = Number(this.getAttribute("rotation")); 
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
        this.rotateKnob();
      }  
    });    
    
    //--------------------------------------------------------
    // Touch events
    //--------------------------------------------------------
    this.addEventListener("touchstart", (e) => 
    { 
        this.knobActive = true;
        this.initialMouseY = Number(e.changedTouches[0].clientY); 
        this.initialRotation = Number(this.getAttribute("rotation"));
    });

    addEventListener("touchend", () => 
    { 
      if(this.knobActive) { this.knobActive = false;} 
    });

    addEventListener("touchmove", (e) => 
    {
      if(this.knobActive) 
      { 
        this.mouseY = Number(e.changedTouches[0].clientY);
        this.rotateKnob(); 
      }  
    });
    
  } // end of constructor

  //--------------------------------------------------------
  // Knob methods
  //--------------------------------------------------------
  rotateKnob()
  {
    let newRotation = (this.initialRotation + this.initialMouseY - this.mouseY) % 360; 
    this.knobBody.style.transform = `rotate(${newRotation}deg)`;
    this.setAttribute("rotation", newRotation);
  }
    
  
});
