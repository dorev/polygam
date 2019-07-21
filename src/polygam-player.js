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
    this.synth1.chain(this.filter1HP, this.filter1LP, Tone.Master);
    this.synth2.chain(this.filter2HP, this.filter2LP, Tone.Master);
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`      
    .player-container
    {   
      margin : 0; padding : 0;
      display: grid;
      padding: 2px;
      grid-gap: 4px;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: auto;
      place-items: stretch;
      position: relative;
    }

    .player-playStop
    {
      grid-column : 1/2;
      grid-row    : 1/2;
      align-self: top;
      justify-self : center;
    }

    .player-volume
    {
      grid-column : 2/3;
      grid-row    : 1/2;
      justify-self : center;
    }

    .player-tempo
    {
      grid-column : 3/4;
      grid-row    : 1/2;
      justify-self : center;
    }

    .player-midi-button
    {
      display : grid;
      place-items : center;
      grid-column : 4/5;
      grid-row    : 1/2;
      justify-self : center;
      border : solid 1px black;
      border-radius : 20px;
      margin : 3px 0 0 0;
      height : 42px;
      width : 120px;
    }

    .player-midi-button:active
    {
      background : #EEE;
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
    this.volumeKnob.label = "volume"
    this.volumeKnob.formatLabel = iValue => iValue.toFixed(1) + " dB";
    this.volumeKnob.knobEvent = this.volumeEvent.bind(this);
    this.volumeKnob.initKnob(0.25);
    this.container.appendChild(this.volumeKnob);    

    // Tempo knob
    this.tempoKnob = document.createElement("polygam-knob");
    this.tempoKnob.setAttribute("class","player-tempo");  
    this.tempoKnob.setAttribute("min","30");  
    this.tempoKnob.setAttribute("max","240");  
    this.tempoKnob.label = "tempo";  
    this.tempoKnob.formatLabel = iValue => Math.floor(iValue).toFixed(0);
    this.tempoKnob.knobEvent = this.tempoEvent.bind(this);
    this.tempoKnob.initKnob(0.470);
    this.container.appendChild(this.tempoKnob);    

    // Save to MIDI button
    this.saveToMidiButton = document.createElement("div");
    this.saveToMidiButton.setAttribute("class","player-midi-button");  
    this.saveToMidiButton.addEventListener("click", this.requestMidi.bind(this));
    
    this.saveToMidiLabel = document.createElement("div"); 
    this.saveToMidiLabel.innerHTML = "Export MIDI";
    this.saveToMidiButton.appendChild(this.saveToMidiLabel);    



    this.container.appendChild(this.saveToMidiButton);    



    this.isReady = true;

  } // end of constructor
        
  // Callback
  playerEvent(){};

  playStopEvent(iButton, iForcedState = "none")
  {
    if(iForcedState !== "none" && (iForcedState === "play" || iForcedState === "stop"))
    {
      this.playStop.forceUpdate(iForcedState);      
      this.playerEvent({type:iForcedState});
      return;
    }

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
    Tone.Master.volume.value = iVolumeKnob.value;
  }
  
  tempoEvent(iTempoKnob)
  {
    this.tempo = Math.floor(iTempoKnob.value);
    
    // Callback
    this.playerEvent({type:"tempo", value:this.tempo});
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
  
  requestMidi()
  {    
    this.playerEvent({type:"midi"});
  }

  midiData(iChords, iBeats)
  {/*
    console.log(iChords);
    console.log(iBeats);

    //if(!iChords.length)
    //{
    //  console.error("No chords in progression, nothing to export");
    //}

    let midiFile = new Midi.File();
    let track = new Midi.Track();
    midiFile.addTrack(track);

    for(let chord = 0; chord < iChords.length; ++chord)
    {      
      for(let beat = 0; beat < iBeats.length; ++beat)
      
      {       
        if(iBeats[beat].some(b => b)) 
        {          
          // Get active notes indexes
          let activeNotesIndex = [];
          for(let i = 0; i < iBeats[beat].length; ++i)
          {
            if(iBeats[beat][i]) { activeNotesIndex.push(i); }
          }
          
          let activeNotes = [];
          activeNotesIndex.forEach(index => 
          {
            if(index < 3)
            {
              activeNotes.push(iChords[chord][index] - 12);
            }
            else if(index < 6)
            {
              activeNotes.push(iChords[chord][index % 3]);
            }
            else if(index < 9)
            {
              activeNotes.push(iChords[chord][index % 3]) + 12;
            }
            else if(index === 10)
            {
              activeNotes.push(iChords[chord][index % 3]) + 24;
            }
            else
            {
              console.error("Note index invalid for midi conversion")
            }
          });

          console.log(activeNotes);

          for(let i = 0; i < activeNotes.length; ++i)
          {
            if(!i) { track.noteOn(0, activeNotes[i], 0); }
            else   { track.noteOn(0, activeNotes[i]); }
          }

          for(let i = 0; i < activeNotes.length; ++i)
          {
            if(!i) { track.noteOff(0, activeNotes[i], 32); }
            else   { track.noteOff(0, activeNotes[i]); }
          }
        }
        else
        {
          track.noteOff(0, '', 32);
        }
      }      
    }*/

    
    let myFile = new Midi.File();
    var myTrack = new Midi.Track();
    myFile.addTrack(myTrack);

    myTrack.addNote(0, 'c4', 64);
    myTrack.addNote(0, 'd4', 64);
    myTrack.addNote(0, 'e4', 64);
    myTrack.addNote(0, 'f4', 64);
    myTrack.addNote(0, 'g4', 64);
    myTrack.addNote(0, 'a4', 64);
    myTrack.addNote(0, 'b4', 64);
    myTrack.addNote(0, 'c5', 64);

    // Save MIDI file
    var blob = new Blob([myFile.toBytes()], {type: "audio/midi"});
    saveAs(blob);
    
  }

});