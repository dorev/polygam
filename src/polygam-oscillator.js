customElements.define("polygam-oscillator", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.oscId = 0;
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`

    oscillator-container
    {
      display: grid;
      place-items : center;
      grid-template-columns : repeat(8, 1fr);
      grid-gap : 2px;
      position: relative;
    }

    svg
    {
      place-self: center;
    }

    .osc-sine-shape
    {      
      grid-column : 1/2;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
    }

    .osc-square-shape
    {      
      grid-column : 2/3;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
    }

    .osc-saw-shape
    {      
      grid-column : 3/4;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
    }

    .osc-triangle-shape
    {      
      grid-column : 4/5;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
    }

    .osc-wave-detune
    {
      grid-column : 5/6;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    .osc-wave-transpose
    {
      grid-column : 6/7;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    .osc-filter-lowpass
    {
      grid-column : 7/8;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    .osc-filter-highpass
    {
      grid-column : 8/9;
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
      buttonLabel.innerHTML = waveform === "sine"     ? "sin" :
                              waveform === "square"   ? "squ" :
                              waveform === "sawtooth" ? "saw" :
                              waveform === "triangle" ? "tri" : "NULL" ;

      this.waveShape.appendChild(radioButton);
      this.waveShape.appendChild(buttonLabel);
    });

    this.waveDetuneKnob = document.createElement("polygam-knob");
    this.waveDetuneKnob.setAttribute("class","osc-wave-detune");  
    this.waveDetuneKnob.setAttribute("min","-100");  
    this.waveDetuneKnob.setAttribute("max","100");     
    this.waveDetuneKnob.knobEvent = this.knobChange.bind(this);
    this.waveDetuneKnob.label = "detune";
    this.waveDetuneKnob.formatLabel = (iValue) => { return iValue.toFixed(0); };
    this.waveDetuneKnob.initKnob(0.5);

    this.waveTransposeKnob = document.createElement("polygam-knob");
    this.waveTransposeKnob.setAttribute("class","osc-wave-transpose");  
    this.waveTransposeKnob.setAttribute("min","-12");  
    this.waveTransposeKnob.setAttribute("max","12");   
    this.waveTransposeKnob.knobEvent = this.knobChange.bind(this);
    this.waveTransposeKnob.label = "transpose";    
    this.waveTransposeKnob.formatLabel = iValue => (iValue >= 0 ? Math.floor(iValue) : Math.ceil(iValue)).toFixed(0);
    this.waveTransposeKnob.initKnob(0.5);

    this.filterLowpassKnob = document.createElement("polygam-knob");
    this.filterLowpassKnob.setAttribute("class","osc-filter-lowpass"); 
    this.filterLowpassKnob.setAttribute("profile","antilog"); 
    this.filterLowpassKnob.knobEvent = this.knobChange.bind(this);
    this.filterLowpassKnob.label = "lowpass";
    this.filterLowpassKnob.formatLabel = (iValue) => { return iValue.toFixed(0); };
    this.filterLowpassKnob.initKnob(1);

    this.filterHighpassKnob = document.createElement("polygam-knob");
    this.filterHighpassKnob.setAttribute("class","osc-filter-highpass"); 
    this.filterHighpassKnob.setAttribute("profile","antilog"); 
    this.filterHighpassKnob.knobEvent = this.knobChange.bind(this);
    this.filterHighpassKnob.label = "highpass";
    this.filterHighpassKnob.formatLabel = (iValue) => { return iValue.toFixed(0); };
    this.filterHighpassKnob.initKnob(0);


    this.sineButton = document.createElement("div");
    this.sineButton.setAttribute("class","osc-sine-shape"); 
    this.sineButton.appendChild(newIcon("sine"));
    this.container.appendChild(this.sineButton);
    
    this.sawButton = document.createElement("div");
    this.sawButton.setAttribute("class","osc-saw-shape"); 
    this.sawButton.appendChild(newIcon("saw"));
    this.container.appendChild(this.sawButton);
    
    this.sineTriangle = document.createElement("div");
    this.sineTriangle.setAttribute("class","osc-triangle-shape"); 
    this.sineTriangle.appendChild(newIcon("triangle"));
    this.container.appendChild(this.sineTriangle);
    
    this.squareButton = document.createElement("div");
    this.squareButton.setAttribute("class","osc-square-shape"); 
    this.squareButton.appendChild(newIcon("square"));
    this.container.appendChild(this.squareButton);

    this.container.appendChild(this.waveShape);
    this.container.appendChild(this.waveDetuneKnob);
    this.container.appendChild(this.waveTransposeKnob);
    this.container.appendChild(this.filterLowpassKnob);
    this.container.appendChild(this.filterHighpassKnob);   

    this.ready = true;

    // Update knobs once
    this.knobChange(this.waveDetuneKnob);
    this.knobChange(this.waveTransposeKnob);
    this.knobChange(this.filterLowpassKnob);
    this.knobChange(this.filterHighpassKnob);
    this.waveShape.querySelector("input[value='sine']").checked = true;
    setTimeout( () => this.oscillatorEvent("waveform", "sine", this.oscId), 500);
         
  } // end of constructor

  // Callback
  oscillatorEvent(property, value, oscId){};

  radioButtonChange(event)
  {
    if(!this.ready) return;
    let button = event.target;
    this.oscillatorEvent(button.getAttribute("name"), button.getAttribute("value"), this.oscId);
  }

  knobChange(iKnob)
  {
    if(!this.ready) return;
    this.oscillatorEvent(iKnob.label, iKnob.value, this.oscId);
  }
  

  
});