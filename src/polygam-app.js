console.clear();
function yeah(param = 999) {
  document.querySelector("div, .yeah").innerText += param + "\n";
}

customElements.define("aw-yeah", class extends HTMLElement
{            
  constructor()
  {
    super();        
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.counter = 0;
    
    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    
         
  } // end of constructor

  setFunction() {}    
  start(){
    this.int = setInterval(() => {
      this.setFunction(this.counter);
      this.counter++;
    }, 1000);
  }
  
  stop(){
    clearInterval(this.int);    
  }
  
});

var custom = document.querySelector("aw-yeah");

console.log(custom);

custom.setFunction = yeah;
custom.start();

setTimeout(() => {custom.stop();},4500);

/*
LOADING STUFF

// Wait for page to have loaded :
window.onload = function ...


// dynamically call js
function require(url, callback) 
{
  var e = document.createElement("script");
  e.src = url;
  e.type="text/javascript";
  e.addEventListener('load', callback);
  document.getElementsByTagName("head")[0].appendChild(e);
}

require("some.js", function() { 
   // Do this and that
});

