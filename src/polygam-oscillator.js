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
      grid-template-columns : repeat(5, 1fr);
      grid-gap : 2px;
    }

    osc-wave-shape
    {      
      grid-column : 1/2;
      place-self: center;
    }

    osc-wave-detune
    {
      grid-column : 2/3;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    osc-wave-transpose
    {
      grid-column : 3/4;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    osc-filter-lowpass
    {
      grid-column : 4/5;
      place-self: center;
      min-height : 50px;
      min-width : 50px;
      text-align: center;
    }

    osc-filter-highpass
    {
      grid-column : 5/6;
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

    this.waveDetune = document.createElement("osc-wave-detune");
    this.waveDetuneKnob = document.createElement("polygam-knob");
    this.waveDetuneKnob.setAttribute("min","-100");  
    this.waveDetuneKnob.setAttribute("max","100");     
    this.waveDetuneKnob.knobEvent = this.knobChange.bind(this);
    this.waveDetuneKnob.label = "detune";
    this.waveDetuneKnob.formatLabel = (iValue) => { return iValue.toFixed(0) };
    this.waveDetuneKnob.initKnob(0.5);
    this.waveDetuneLabel = document.createElement("span");
    this.waveDetuneLabel.innerHTML = "detune";
    this.waveDetune.appendChild(this.waveDetuneKnob); 
    this.waveDetune.appendChild(this.waveDetuneLabel);

    this.waveTranspose = document.createElement("osc-wave-transpose");
    this.waveTransposeKnob = document.createElement("polygam-knob");
    this.waveTransposeKnob.setAttribute("min","-12");  
    this.waveTransposeKnob.setAttribute("max","12");   
    this.waveTransposeKnob.knobEvent = this.knobChange.bind(this);
    this.waveTransposeKnob.label = "transpose";    
    this.waveTransposeKnob.initKnob(0.5);
    this.waveTransposeLabel = document.createElement("span");
    this.waveTransposeLabel.innerHTML = "transpose";  
    this.waveTranspose.appendChild(this.waveTransposeKnob); 
    this.waveTranspose.appendChild(this.waveTransposeLabel);    

    this.filterLowpass = document.createElement("osc-filter-lowpass");
    this.filterLowpassKnob = document.createElement("polygam-knob");
    this.filterLowpassKnob.setAttribute("profile","antilog"); 
    this.filterLowpassKnob.knobEvent = this.knobChange.bind(this);
    this.filterLowpassKnob.label = "lowpass";
    this.filterLowpassKnob.initKnob(1);
    this.filterLowpassLabel = document.createElement("div");
    this.filterLowpassLabel.innerHTML = "lowpass";  
    this.filterLowpass.appendChild(this.filterLowpassKnob);  
    this.filterLowpass.appendChild(this.filterLowpassLabel);  

    this.filterHighpass = document.createElement("osc-filter-highpass");
    this.filterHighpassKnob = document.createElement("polygam-knob");
    this.filterHighpassKnob.setAttribute("profile","antilog"); 
    this.filterHighpassKnob.knobEvent = this.knobChange.bind(this);
    this.filterHighpassKnob.label = "highpass";
    this.filterHighpassKnob.initKnob(0);
    this.filterHighpassLabel = document.createElement("div");
    this.filterHighpassLabel.innerHTML = "highpass";  
    this.filterHighpass.appendChild(this.filterHighpassKnob);  
    this.filterHighpass.appendChild(this.filterHighpassLabel);    

    this.container.appendChild(this.waveShape);
    this.container.appendChild(this.waveDetune);
    this.container.appendChild(this.waveTranspose);
    this.container.appendChild(this.filterLowpass);
    this.container.appendChild(this.filterHighpass);   

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
    
    switch(iKnob.label)
    {          
        case "detune" :
          this.waveDetuneLabel.innerHTML = `detune<br>${iKnob.value.toFixed(0)}`;   
          break;
            
        case "transpose" :
            let value = (iKnob.value >= 0 ? Math.floor(iKnob.value) : Math.ceil(iKnob.value))
            this.waveTransposeLabel.innerHTML = `transpose<br>${value.toFixed(0)}`;   
          break;
  
        case "lowpass":
            this.filterLowpassLabel.innerHTML = `lowpass<br>${iKnob.value.toFixed(0)}`;
          break;
        
        case "highpass" :   
          this.filterHighpassLabel.innerHTML = `highpass<br>${iKnob.value.toFixed(0)}`;   
          break;

        default : console.error("Unknown knob name");
    }

  }
  

  
});