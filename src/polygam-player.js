customElements.define("polygam-player", class extends HTMLElement
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
    .player-container
    {   
      place-self: center;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows:    auto auto auto;
      height: 100px;
      place-items: stretch;
    }

    .player-playstop
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
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  

    this.container = document.createElement("div");
    this.container.setAttribute("class","player-container");    
    shadow.appendChild(this.container);

    // Play/stop button
    this.playstop = document.createElement("polygam-playstop");
    this.playstop.setAttribute("class","player-playstop");  
    this.playstop.buttonEvent = this.playstopEvent.bind(this);
    this.container.appendChild(this.playstop);

    // Volume knob
    this.volumeKnob = document.createElement("polygam-knob");
    this.volumeKnob.setAttribute("class","player-volume"); 
    this.volumeKnob.knobEvent = this.volumeEvent.bind(this);
    this.container.appendChild(this.volumeKnob);

    this.volumeValue = document.createElement("div");
    this.volumeValue.setAttribute("class","player-volume-value");  
    this.volumeValue.innerHTML = "50";
    this.container.appendChild(this.volumeValue);

    this.volumeLabel = document.createElement("div");
    this.volumeLabel.setAttribute("class","player-volume-label");  
    this.volumeLabel.innerHTML = "VOL";
    this.container.appendChild(this.volumeLabel);

    // Tempo knob
    this.tempoKnob = document.createElement("polygam-knob");
    this.tempoKnob.setAttribute("class","player-tempo");  
    this.tempoKnob.knobEvent = this.tempoEvent.bind(this);
    this.container.appendChild(this.tempoKnob);

    this.tempoValue = document.createElement("div");
    this.tempoValue.setAttribute("class","player-tempo-value");  
    this.tempoValue.innerHTML = "120";
    this.container.appendChild(this.tempoValue);

    this.tempoLabel = document.createElement("div");
    this.tempoLabel.setAttribute("class","player-tempo-label");  
    this.tempoLabel.innerHTML = "TEMPO";
    this.container.appendChild(this.tempoLabel);

  } // end of constructor
  
  
  playstopEvent(iButton)
  {
    console.log(iButton.status);
  }
  
  volumeEvent(iVolumeKnob)
  {
    this.volumeValue.innerHTML = iVolumeKnob.value > 99.1 ? 100 : Math.floor(iVolumeKnob.value);
  }
  
  tempoEvent(iTempoKnob)
  {
    this.tempoValue.innerHTML = iTempoKnob.value > 99.5 ? 180 : Math.floor(iTempoKnob.value * 1.2 + 60);
  }




  
});