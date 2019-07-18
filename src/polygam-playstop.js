customElements.define("polygam-playstop", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;  
    this.isPlaying = false;  

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .playstop-container
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
    this.container.setAttribute("class","playstop-container");    
    shadow.appendChild(this.container);
    
    // Create SVG
    let s = this.size;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.svg.setAttribute("width", s);
    this.svg.setAttribute("height", s);
    this.container.appendChild(this.svg);
    
    // Button body
    this.buttonBody = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.buttonBody.setAttribute("cx", s*0.5);
    this.buttonBody.setAttribute("cy", s*0.5);
    this.buttonBody.setAttribute("r", s/2.25);
    this.buttonBody.setAttribute("stroke","#000");
    this.buttonBody.setAttribute("stroke-width",s*0.025);
    this.buttonBody.setAttribute("fill","#FFF");
    this.svg.appendChild(this.buttonBody);

    // Stop icon
    this.stopIcon = document.createElementNS("http://www.w3.org/2000/svg", "rect"); 
    this.stopIcon.setAttribute("x", s*0.3);
    this.stopIcon.setAttribute("y", s*0.3);
    this.stopIcon.setAttribute("width", s*0.4);
    this.stopIcon.setAttribute("height", s*0.4);
    this.stopIcon.setAttribute("fill","#000");   
    this.stopIcon.setAttribute("visibility","hidden");   
    this.svg.appendChild(this.stopIcon);

    // Play icon
    this.playIcon = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
    this.playIcon.setAttribute("d", `M${s*0.35} ${s*0.25} L${s*0.75} ${s*0.5} L${s*0.35} ${s*0.75} Z`);
    this.playIcon.setAttribute("fill","#000");   
    this.playIcon.setAttribute("visibility","visible");   
    this.svg.appendChild(this.playIcon);    
    
    // Click overlay
    this.buttonOverlay = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.buttonOverlay.setAttribute("cx", s*0.5);
    this.buttonOverlay.setAttribute("cy", s*0.5);
    this.buttonOverlay.setAttribute("r", s/2.25);
    this.buttonOverlay.setAttribute("fill-opacity",0);
    this.svg.appendChild(this.buttonOverlay);

    // Bind events
    this.buttonOverlay.addEventListener("click", this.click.bind(this));

    // Adding "Space" as play-stop shortcut
    document.addEventListener("keypress", (event) => 
    {
      if(event.key !== " ") { return; }
      this.click();
    });
         
  } // end of constructor

  // Callback
  buttonEvent() {}  
  
  click(iForcedState = null)
  {
    this.isPlaying = !(this.isPlaying);   
    if(iForcedState !== null)
    {
      this.isPlaying = iForcedState;
    }
    this.stopIcon.setAttribute("visibility", this.isPlaying ? "visible" : "hidden"); 
    this.playIcon.setAttribute("visibility", this.isPlaying ? "hidden" : "visible");
    
    // Callback
    this.buttonEvent(this);
  }

  
});