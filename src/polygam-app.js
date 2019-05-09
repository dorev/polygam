customElements.define("polygam-app", class extends HTMLElement
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
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    
         
  } // end of constructor
  


});

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



// CUTE CSS!!
https://cssfx.dev/
