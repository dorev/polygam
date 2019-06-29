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
      grid-template-columns : repeat(4, 1fr);
      grid-template-row : repeat(3, 1fr);
      grid-gap : 2px;
    }


    .wave-shape-title
    {      
      grid-column : 1/3;
      grid-row    : 1/2;
      place-self: center;
    }
    .filter-shape-title
    {      
      grid-column : 3/5;
      grid-row    : 1/2;
      place-self: center;
      min-height : 20px;
    }

    osc-wave-shape
    {      
      grid-column : 1/3;
      grid-row    : 2/3;
      place-self: center;
    }

    osc-wave-detune
    {
      grid-column : 1/2;
      grid-row    : 3/4;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    osc-wave-transpose
    {
      grid-column : 2/3;
      grid-row    : 3/4;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    osc-filter-shape
    {
      grid-column : 3/5;
      grid-row    : 2/3;
      place-self: center;
    }

    osc-filter-frequency
    {
      grid-column : 3/4;
      grid-row    : 3/4;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    osc-filter-q
    {
      grid-column : 4/5;
      grid-row    : 3/4;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
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
    ["sine", "square", "sawtooth", "triangle"].forEach( waveform =>
    {
      let radioButton = document.createElement("input");
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", "waveform");
      radioButton.setAttribute("value", waveform);
      radioButton.addEventListener("change", this.radioButtonChange.bind(this));
      
      let buttonLabel = document.createElement("label");      
      buttonLabel.setAttribute("for", waveform);
      buttonLabel.innerHTML = waveform;

      this.waveShape.appendChild(radioButton);
      this.waveShape.appendChild(buttonLabel);
    });

    this.waveDetune = document.createElement("osc-wave-detune");
    this.waveDetuneKnob = document.createElement("polygam-knob");
    this.waveDetuneKnob.setAttribute("min","-100");  
    this.waveDetuneKnob.setAttribute("max","100");     
    this.waveDetuneKnob.knobEvent = this.knobChange.bind(this);
    this.waveDetuneKnob.name = "detune";
    this.waveDetuneKnob.initKnob();
    this.waveDetuneLabel = document.createElement("span");
    this.waveDetuneLabel.innerHTML = "detune";
    this.waveDetune.appendChild(this.waveDetuneKnob); 
    this.waveDetune.appendChild(this.waveDetuneLabel);

    this.wavetranspose = document.createElement("osc-wave-transpose");
    this.wavetransposeKnob = document.createElement("polygam-knob");
    this.wavetransposeKnob.setAttribute("min","-12");  
    this.wavetransposeKnob.setAttribute("max","12");   
    this.wavetransposeKnob.knobEvent = this.knobChange.bind(this);
    this.wavetransposeKnob.name = "transpose";    
    this.wavetransposeKnob.initKnob();
    this.wavetransposeLabel = document.createElement("span");
    this.wavetransposeLabel.innerHTML = "transpose";  
    this.wavetranspose.appendChild(this.wavetransposeKnob); 
    this.wavetranspose.appendChild(this.wavetransposeLabel);    

    this.filterShape = document.createElement("osc-filter-shape");
    ["lowpass", "highpass", "bandpass", "none"].forEach( filterType =>
    {
      let radioButton = document.createElement("input");
      radioButton.setAttribute("type", "radio");
      radioButton.setAttribute("name", "filterType");
      radioButton.setAttribute("value", filterType);
      radioButton.addEventListener("change", this.radioButtonChange.bind(this));
      
      let buttonLabel = document.createElement("label");      
      buttonLabel.setAttribute("for", filterType);
      buttonLabel.innerHTML = filterType;

      this.filterShape.appendChild(radioButton);
      this.filterShape.appendChild(buttonLabel);
    });

    this.filterFreq = document.createElement("osc-filter-frequency");
    this.filterFreqKnob = document.createElement("polygam-knob");
    this.filterFreqKnob.setAttribute("min","20");  
    this.filterFreqKnob.setAttribute("max","20000"); 
    this.filterFreqKnob.knobEvent = this.knobChange.bind(this);
    this.filterFreqKnob.name = "frequency";
    this.filterFreqKnob.initKnob();
    this.filterFreqLabel = document.createElement("span");
    this.filterFreqLabel.innerHTML = "frequency";  
    this.filterFreq.appendChild(this.filterFreqKnob);  
    this.filterFreq.appendChild(this.filterFreqLabel);    
    //this.filterFreq.innerHTML = "filterFreq";

    this.filterQ = document.createElement("osc-filter-q");
    this.filterQKnob = document.createElement("polygam-knob");
    this.filterQKnob.setAttribute("min","0");  
    this.filterQKnob.setAttribute("max","4"); 
    this.filterQKnob.knobEvent = this.knobChange.bind(this);
    this.filterQKnob.name = "q"; 
    this.filterQKnob.initKnob();
    this.filterQLabel = document.createElement("span");
    this.filterQLabel.innerHTML = "q";   
    this.filterQ.appendChild(this.filterQKnob);      
    this.filterQ.appendChild(this.filterQLabel);       
    //this.filterQ.innerHTML = "filterQ";

    this.container.appendChild(this.waveShape);
    this.container.appendChild(this.waveDetune);
    this.container.appendChild(this.wavetranspose);
    this.container.appendChild(this.filterShape);
    this.container.appendChild(this.filterFreq);
    this.container.appendChild(this.filterQ);   


    
    let waveShapeTitle = document.createElement("div");
    waveShapeTitle.setAttribute("class","wave-shape-title"); 
    waveShapeTitle.innerHTML = "waveform";

    let filterShapeTitle = document.createElement("div");
    filterShapeTitle.setAttribute("class","filter-shape-title"); 
    filterShapeTitle.innerHTML = "filter";

    this.container.appendChild(waveShapeTitle);   
    this.container.appendChild(filterShapeTitle);   


         
  } // end of constructor

  // Callback
  oscillatorEvent(property, value){};

  radioButtonChange(event)
  {
    let button = event.target;
    this.oscillatorEvent(button.getAttribute("name"), button.getAttribute("value"));
  }

  knobChange(iKnob)
  {
    this.oscillatorEvent(iKnob.name, iKnob.value);
  }
  

  
});