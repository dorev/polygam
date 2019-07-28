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

    .oscillator-container
    {
      display: grid;
      place-items : center;
      grid-template-columns : repeat(8, 1fr);
      grid-gap : 2px;
    }

    .osc-sine-shape
    {      
      grid-column : 1/2;
      place-self: center;
    }

    .osc-square-shape
    {      
      grid-column : 2/3;
      place-self: center;
    }

    .osc-saw-shape
    {      
      grid-column : 3/4;
      place-self: center;
    }

    .osc-triangle-shape
    {      
      grid-column : 4/5;
      place-self: center;
    }

    .osc-wave-detune
    {
      grid-column : 5/6;
      place-self: center;
    }

    .osc-wave-transpose
    {
      grid-column : 6/7;
      place-self: center;
    }

    .osc-filter-lowpass
    {
      grid-column : 7/8;
      place-self: center;
    }

    .osc-filter-highpass
    {
      grid-column : 8/9;
      place-self: center;
    }

    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  

    this.container = document.createElement("oscillator-container");
    this.container.setAttribute("class","oscillator-container");
    shadow.appendChild(this.container);  

    //this.waveShape = document.createElement("osc-wave-shape");
    //["sine", "square", "sawtooth", "triangle"].forEach( waveform =>
    //{
    //  let radioButton = document.createElement("input");
    //  radioButton.setAttribute("type", "radio");
    //  radioButton.setAttribute("name", "waveform");
    //  radioButton.setAttribute("value", waveform);
    //  radioButton.addEventListener("change", this.radioButtonChange.bind(this));
    //  
    //  let buttonLabel = document.createElement("label");      
    //  buttonLabel.setAttribute("for", waveform);
    //  buttonLabel.innerHTML = waveform === "sine"     ? "sin" :
    //                          waveform === "square"   ? "squ" :
    //                          waveform === "sawtooth" ? "saw" :
    //                          waveform === "triangle" ? "tri" : "NULL" ;
//
    //  this.waveShape.appendChild(radioButton);
    //  this.waveShape.appendChild(buttonLabel);
    //});

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


    this.sineButton = document.createElement("polygam-button");
    this.sineButton.setAttribute("class","osc-sine-shape"); 
    this.sineButton.icon = "sinePath";
    this.sineButton.label = "sin";
    this.sineButton.value = true;
    this.sineButton.buttonEvent = this.buttonChange.bind(this);
    this.sineButton.initButton();
    this.container.appendChild(this.sineButton);
    
    this.squareButton = document.createElement("polygam-button");
    this.squareButton.setAttribute("class","osc-square-shape"); 
    this.squareButton.icon = "squarePath";
    this.squareButton.label = "squ";
    this.squareButton.value = false;
    this.squareButton.buttonEvent = this.buttonChange.bind(this);
    this.squareButton.initButton();
    this.container.appendChild(this.squareButton);

    this.sawButton = document.createElement("polygam-button");
    this.sawButton.setAttribute("class","osc-saw-shape"); 
    this.sawButton.icon = "sawPath";
    this.sawButton.label = "saw";
    this.sawButton.value = false;
    this.sawButton.buttonEvent = this.buttonChange.bind(this);
    this.sawButton.initButton();
    this.container.appendChild(this.sawButton);
    
    this.triangleButton = document.createElement("polygam-button");
    this.triangleButton.setAttribute("class","osc-triangle-shape"); 
    this.triangleButton.icon = "trianglePath";
    this.triangleButton.label = "tri";
    this.triangleButton.value = false;
    this.triangleButton.buttonEvent = this.buttonChange.bind(this);
    this.triangleButton.initButton();
    this.container.appendChild(this.triangleButton);

    //this.container.appendChild(this.waveShape);
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
    setTimeout( () => this.buttonChange(this.sineButton), 500);
         
  } // end of constructor

  // Callback
  oscillatorEvent(property, value, oscId){};

  knobChange(iKnob)
  {
    if(!this.ready) return;
    this.oscillatorEvent(iKnob.label, iKnob.value, this.oscId);
  }

  buttonChange(iButton)
  {
    if(!this.ready || !iButton.value) return;
    
    let waveform;
    switch(iButton.label)
    {
      case "sin" : waveform =  "sine";      break;
      case "squ" : waveform =  "square";    break;
      case "saw" : waveform =  "sawtooth";  break;
      case "tri" : waveform =  "triangle";  break;
      default :
        console.log("Invalid button label")
        return;
    }    

    this.radioButtonUpdate(iButton.label);
    this.oscillatorEvent("waveform", waveform, this.oscId);    
  }
  
  radioButtonUpdate(iSelectedButton)
  {
    [this.sineButton, this.squareButton, this.sawButton, this.triangleButton]
    .forEach(button => 
    {
        button.forceUpdate(button.label === iSelectedButton);      
    });

  }

  
});