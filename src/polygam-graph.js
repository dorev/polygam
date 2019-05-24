customElements.define("polygam-graph", class extends HTMLElement
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
    .graph-container
    {   
      place-self : stretch;
      min-height: 300px;
      border : dotted 1px silver;

    }

    .node {
      fill: #FFF;
      stroke: #000;
      stroke-width: 1px;
    }
    
    `;  
    
    //--------------------------------------------------------
    // Construct custom element
    //--------------------------------------------------------
    
    // Main container
    let shadow = this.attachShadow({mode: 'open'});  
    shadow.appendChild(style);  
    this.container = document.createElement("div");
    this.container.setAttribute("class","graph-container");    
    shadow.appendChild(this.container);

    setTimeout(()=>{this.initGraph()},1000);
    

         
  } // end of constructor


  initGraph()
  {
    this.graph = new Graph(this.container);
    this.graph.addNode({id:1});
    this.graph.addNode({id:2});
    this.graph.addNode({id:3});
  }

});