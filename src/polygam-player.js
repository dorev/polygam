customElements.define("polygam-player", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    

    this.volume = 50;
    this.tempo = 128;
    this.isPlaying = false;

    // Tone.js nodes
    this.synth1 = new Tone.PolySynth(10, Tone.Synth);
    this.synth1.volume.value = -6;

    this.synth2 = new Tone.PolySynth(10, Tone.Synth);
    this.synth2.volume.value = -6;

    this.synths = 
    [
      this.synth1, 
      this.synth2
    ];

    this.filter1LP = new Tone.Filter(20000, "lowpass", -24);
    this.filter1HP = new Tone.Filter(20, "highpass", -24);
    this.filter2LP = new Tone.Filter(20000, "lowpass", -24);
    this.filter2HP = new Tone.Filter(20, "highpass", -24);

    this.filters = 
    [
      {
        "lowpass" : this.filter1LP, 
        "highpass" : this.filter1HP
      },
      {
        "lowpass" : this.filter2LP, 
        "highpass" : this.filter2HP
      }
    ];
    
    // Nodes connection
    this.synth1.chain(this.filter1HP, this.filter1LP, Tone.Master)
    this.synth2.chain(this.filter2HP, this.filter2LP, Tone.Master)
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`      
    .player-container
    {   
      margin : 0; padding : 0;
      place-self: center;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: repeat(5, auto);
      grid-template-rows:    auto auto auto;
      height: 100px;
      place-items: stretch;
    }

    .player-playStop
    {
      grid-column : 1/2;
      grid-row    : 1/2;
      place-self: center;
    }

    .player-volume
    {
      grid-column : 2/3;
      grid-row    : 1/2;
      place-self: center;
    }

    .player-tempo
    {
      grid-column : 3/4;
      grid-row    : 1/2;
      place-self: center;
    }

    .player-volume-label
    {
      grid-column : 2/3;
      grid-row    : 3/4;
      place-self: center;
    }

    .player-volume-value
    {
      grid-column : 2/3;
      grid-row    : 2/3;
      place-self: center;
    }

    .player-tempo-value
    {
      grid-column : 3/4;
      grid-row    : 2/3;
      place-self: center;
    }

    .player-tempo-label
    {
      grid-column : 3/4;
      grid-row    : 3/4;
      place-self: center;
    }

    .player-reverb
    {
      grid-column : 4/5;
      grid-row    : 1/2;
      place-self: center;
    }

    .player-reverb-value
    {
      grid-column : 4/5;
      grid-row    : 2/3;
      place-self: center;
    }

    .player-reverb-label
    {
      grid-column : 4/5;
      grid-row    : 3/4;
      place-self: center; 
    }

    .player-delay
    {
      grid-column : 5/6;
      grid-row    : 1/2;
      place-self: center;
    }

    .player-delay-value
    {
      grid-column : 5/6;
      grid-row    : 2/3;
      place-self: center;
    }

    .player-delay-label
    {
      grid-column : 5/6;
      grid-row    : 3/4;
      place-self: center; 
    }


    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style); 
    this.container = document.createElement("div");
    this.container.setAttribute("class","player-container");    
    shadow.appendChild(this.container);

    // Play/stop button
    this.playStop = document.createElement("polygam-playStop");
    this.playStop.setAttribute("class","player-playStop");  
    this.playStop.buttonEvent = this.playStopEvent.bind(this);
    this.container.appendChild(this.playStop);

    // Volume knob
    this.volumeKnob = document.createElement("polygam-knob");
    this.volumeKnob.setAttribute("class","player-volume"); 
    this.volumeKnob.setAttribute("profile","10log2");  
    this.volumeKnob.knobEvent = this.volumeEvent.bind(this);
    this.container.appendChild(this.volumeKnob);
    
    this.volumeValue = document.createElement("div");
    this.volumeValue.setAttribute("class","player-volume-value");  
    this.container.appendChild(this.volumeValue);
    
    this.volumeLabel = document.createElement("div");
    this.volumeLabel.setAttribute("class","player-volume-label");  
    this.volumeLabel.innerHTML = "vol";
    this.container.appendChild(this.volumeLabel);
    
    this.volumeKnob.initKnob(0.25);

    // Tempo knob
    this.tempoKnob = document.createElement("polygam-knob");
    this.tempoKnob.setAttribute("class","player-tempo");  
    this.tempoKnob.setAttribute("min","30");  
    this.tempoKnob.setAttribute("max","240");  
    this.tempoKnob.knobEvent = this.tempoEvent.bind(this);
    this.container.appendChild(this.tempoKnob);
    
    this.tempoValue = document.createElement("div");
    this.tempoValue.setAttribute("class","player-tempo-value");  
    this.container.appendChild(this.tempoValue);
    
    this.tempoLabel = document.createElement("div");
    this.tempoLabel.setAttribute("class","player-tempo-label");  
    this.tempoLabel.innerHTML = "tem";
    this.container.appendChild(this.tempoLabel);
    
    this.tempoKnob.initKnob(0.470);

    // Reverb knob
    this.reverbKnob = document.createElement("polygam-knob");
    this.reverbKnob.setAttribute("class","player-reverb");  
    this.reverbKnob.knobEvent = this.reverbEvent.bind(this);
    this.container.appendChild(this.reverbKnob);
    
    this.reverbValue = document.createElement("div");
    this.reverbValue.setAttribute("class","player-reverb-value");  
    this.reverbValue.innerHTML = "0";  
    this.container.appendChild(this.reverbValue);
    
    this.reverbLabel = document.createElement("div");
    this.reverbLabel.setAttribute("class","player-reverb-label");  
    this.reverbLabel.innerHTML = "rev";
    this.container.appendChild(this.reverbLabel);    
    this.reverbKnob.initKnob(0.20);

    // Delay knob
    this.delayKnob = document.createElement("polygam-knob");
    this.delayKnob.setAttribute("class","player-delay"); 
    this.delayKnob.knobEvent = this.delayEvent.bind(this);
    this.container.appendChild(this.delayKnob);
    
    this.delayValue = document.createElement("div");
    this.delayValue.setAttribute("class","player-delay-value");  
    this.delayValue.innerHTML = "0";  
    this.container.appendChild(this.delayValue);
    
    this.delayLabel = document.createElement("div");
    this.delayLabel.setAttribute("class","player-delay-label");  
    this.delayLabel.innerHTML = "del";
    this.container.appendChild(this.delayLabel);    
    this.delayKnob.initKnob(0.20);

    this.isReady = true;

  } // end of constructor
        
  // Callback
  playerEvent(){};

  playStopEvent(iButton)
  {
    this.isPlaying = iButton.isPlaying;
    
    if(this.isPlaying)
    {
      // Callback
      this.playerEvent({type:"play"});
    }
    else
    {
      // Callback
      this.playerEvent({type:"stop"});
    }
  }
  
  volumeEvent(iVolumeKnob)
  {
    this.volume = iVolumeKnob.value;
    this.volumeValue.innerHTML = iVolumeKnob.value.toFixed(2) + " dB";
    Tone.Master.volume.value = iVolumeKnob.value;
  }
  
  tempoEvent(iTempoKnob)
  {
    this.tempo = Math.floor(iTempoKnob.value);
    this.tempoValue.innerHTML = this.tempo;
    
    // Callback
    this.playerEvent({type:"tempo", value:this.tempo});
  }

  reverbEvent(iReverbKnob)
  {

  }

  delayEvent(iDelayKnob)
  {

  }


  playNotes(iNotesArray)
  {
    if(!this.isReady) return;

    // attackrelease with Tone.js    
    if(!iNotesArray.some(n => n != null)) { return; }
    let notesToPlay = iNotesArray.filter(n => n != null);

    this.synths.forEach( synth =>
    {
      synth.triggerAttackRelease(notesToPlay.map(n => Tone.Frequency(n, "midi")), 60 / (this.tempo * 4));  
    });
  }

  setOscillatorProperties(iProperties, iSynthId = 0)
  {
    let synth = this.synths[iSynthId];

    for(let iProperty in iProperties)
    {
      switch(iProperty)
      {
        case "type" :
          synth.set({oscillator: {type: iProperties[iProperty] }});
          break;
        case "detune" :
          synth.detune.value = iProperties[iProperty];
          break;
        default :
          console.log("Invalid synth property")
          break;
      }
    }
  }

  setFilterProperties(iProperties, iOscId = 0, iFilterType)
  {
    let filter = this.filters[iOscId];
    console.log(iProperties);
    //console.log(filter);

    for(let iProperty in iProperties)
    {
      switch(iProperty)
      {
        case "frequency" :
          filter[iFilterType].frequency.value = iProperties[iProperty];
          break;
        default :
          console.log("Invalid filter property")
          break;
      }
    }
  }
  
});