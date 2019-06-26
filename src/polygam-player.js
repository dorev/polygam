customElements.define("polygam-player", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    

    this.volume = 50;
    this.tempo = 120;
    this.isPlaying = false;
    this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
    this.synth.volume.value = -50;
    
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
      grid-template-columns: repeat(3, 1fr);
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
    this.volumeLabel.innerHTML = "VOL";
    this.container.appendChild(this.volumeLabel);
    
    this.volumeKnob.initKnob();

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
    this.tempoLabel.innerHTML = "TEMPO";
    this.container.appendChild(this.tempoLabel);
    
    this.tempoKnob.initKnob();

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
    this.synth.volume.value = iVolumeKnob.value;
  }
  
  tempoEvent(iTempoKnob)
  {
    this.tempo = Math.floor(iTempoKnob.value);
    this.tempoValue.innerHTML = this.tempo;
    
    // Callback
    this.playerEvent({type:"tempo", value:this.tempo});
  }


  playNotes(iNotesArray)
  {
    // attackrelease with Tone.js    
    if(!iNotesArray.some(n => n != null)) { return; }
    let notesToPlay = iNotesArray.filter(n => n != null);

    this.synth.triggerAttackRelease(notesToPlay.map(n => Tone.Frequency(n, "midi")), 60 / (this.tempo * 4));  
  }

  
});