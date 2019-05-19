customElements.define("polygam-playstop", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.size = this.hasAttribute("size") ? parseInt(this.getAttribute("size")) : 50;  
    this.status = false;  

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    .playstop-container
    {   
      display: grid;
      width: ${this.size}px;
      height: ${this.size}px;
    }
    `;
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
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
    
    this.buttonBody = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.buttonBody.setAttribute("cx", s*0.5);
    this.buttonBody.setAttribute("cy", s*0.5);
    this.buttonBody.setAttribute("r", s/2.25);
    this.buttonBody.setAttribute("stroke","#000");
    this.buttonBody.setAttribute("stroke-width",s*0.05);
    this.buttonBody.setAttribute("fill","#FF0");
    this.svg.appendChild(this.buttonBody);

    this.stopIcon = document.createElementNS("http://www.w3.org/2000/svg", "rect"); 
    this.stopIcon.setAttribute("x", s*0.3);
    this.stopIcon.setAttribute("y", s*0.3);
    this.stopIcon.setAttribute("width", s*0.4);
    this.stopIcon.setAttribute("height", s*0.4);
    this.stopIcon.setAttribute("fill","#F00");   
    this.stopIcon.setAttribute("visibility","hidden");   
    this.svg.appendChild(this.stopIcon);

    this.playIcon = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
    this.playIcon.setAttribute("d", `M${s*0.35} ${s*0.25} L${s*0.75} ${s*0.5} L${s*0.35} ${s*0.75} Z`);
    this.playIcon.setAttribute("fill","#00F");   
    this.playIcon.setAttribute("visibility","visible");   
    this.svg.appendChild(this.playIcon);    
    
    this.buttonOverlay = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
    this.buttonOverlay.setAttribute("cx", s*0.5);
    this.buttonOverlay.setAttribute("cy", s*0.5);
    this.buttonOverlay.setAttribute("r", s/2.25);
    this.buttonOverlay.setAttribute("fill-opacity",0);
    this.svg.appendChild(this.buttonOverlay);

    // Bind events
    this.buttonOverlay.addEventListener("click", this.click.bind(this));

         
  } // end of constructor

  // Callback
  buttonEvent() {}  
  
  click()
  {

    this.status = !(this.status);   
    this.stopIcon.setAttribute("visibility", this.status ? "visible" : "hidden"); 
    this.playIcon.setAttribute("visibility", this.status ? "hidden" : "visible");
    this.buttonEvent(this);
  }

  
});