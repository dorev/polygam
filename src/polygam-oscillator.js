customElements.define("polygam-oscillator", class extends HTMLElement
{            
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

    oscillator-container
    {
      display: grid;
      grid-template-columns : repeat(3, 1fr);
      grid-template-row : repeat(2, 1fr);
      grid-gap : 2px;
    }


    osc-wave-shape
    {      
      grid-column : 1/2;
      grid-row    : 1/2;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      border: solid red 1px;
    }

    osc-wave-detune
    {
      grid-column : 2/3;
      grid-row    : 1/2;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      border: solid red 1px;
    }

    osc-wave-transpose
    {
      grid-column : 3/4;
      grid-row    : 1/2;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      border: solid red 1px;
    }

    osc-filter-shape
    {
      grid-column : 1/2;
      grid-row    : 2/3;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      border: solid red 1px;
    }

    osc-filter-frequency
    {
      grid-column : 2/3;
      grid-row    : 2/3;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      border: solid red 1px;
    }

    osc-filter-q
    {
      grid-column : 3/4;
      grid-row    : 2/3;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      border: solid red 1px;
    }

    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  

    this.container = document.createElement("oscillator-container");
    //this.container.setAttribute("class", "oscillator-container");
    shadow.appendChild(this.container);  

    this.waveShape = document.createElement("osc-wave-shape");
    this.waveShape.innerHTML = "waveShape";

    this.waveDetune = document.createElement("osc-wave-detune");
    this.waveDetuneKnob = document.createElement("polygam-knob");
    this.waveDetuneKnob.setAttribute("min","-100");  
    this.waveDetuneKnob.setAttribute("max","100");      
    this.waveDetune.appendChild(this.waveDetuneKnob);     
    //this.waveDetune.innerHTML = "waveDetune";

    this.waveTranspose = document.createElement("osc-wave-transpose");
    this.waveTransposeKnob = document.createElement("polygam-knob");
    this.waveTransposeKnob.setAttribute("min","-24");  
    this.waveTransposeKnob.setAttribute("max","24");      
    this.waveTranspose.appendChild(this.waveTransposeKnob);    
    //this.waveTranspose.innerHTML = "waveTranspose";

    this.filterShape = document.createElement("osc-filter-shape");
    this.filterShape.innerHTML = "filterShape";

    this.filterFreq = document.createElement("osc-filter-frequency");
    this.filterFreqKnob = document.createElement("polygam-knob");
    this.filterFreqKnob.setAttribute("min","-100");  
    this.filterFreqKnob.setAttribute("max","100");  
    this.filterFreq.appendChild(this.filterFreqKnob);    
    //this.filterFreq.innerHTML = "filterFreq";

    this.filterQ = document.createElement("osc-filter-q");
    this.filterQKnob = document.createElement("polygam-knob");
    this.filterQKnob.setAttribute("min","-100");  
    this.filterQKnob.setAttribute("max","100");   
    this.filterQ.appendChild(this.filterQKnob);       
    //this.filterQ.innerHTML = "filterQ";

    this.container.appendChild(this.waveShape);
    this.container.appendChild(this.waveDetune);
    this.container.appendChild(this.waveTranspose);
    this.container.appendChild(this.filterShape);
    this.container.appendChild(this.filterFreq);
    this.container.appendChild(this.filterQ);   
         
  } // end of constructor
  

  
});