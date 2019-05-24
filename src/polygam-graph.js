customElements.define("polygam-graph", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    
    this.graphTasks = [];
    this.processTick = null;
    this.taskTempo = 50;
    this.state = "uninit";

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

    .link {
      stroke: #000;
      stroke-width: 1px;
    }

    .graph-text {
      fill: black;
      stroke: none;
      font-family: "Polygam", sans-serif;
      font-size: 0.8em;
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

    // temporary loadtime patch
    setTimeout(()=>{this.initGraph()},500);
   

         
  } // end of constructor

  initGraph()
  {
    console.log("Initializing graph")
    this.graph = new Graph(this.container);
    this.graph.nodeClick = this.nodeClicked.bind(this);

    var graphInitialNodes = [
      "C",
      "Cm",
      "C#",
      "C#m",
      "D",
      "Dm",
      "Eb",
      "Ebm",
      "E",
      "Em",
      "F",
      "Fm",
      "F#",
      "F#m",
      "G",
      "Gm",
      "Ab",
      "Abm",
      "A",
      "Am",
      "Bb",
      "Bbm",
      "B",
      "Bm"
    ].forEach(chordName => 
    {
      this.queueTask(()=>
      {
        this.graph.addNode({name:chordName});

        let nodeCount = this.graph.nodesData.length;
        
        if(nodeCount > 0)
        {
          let currId = this.graph.nodesData.map(n => n.id)[nodeCount-1];
          this.graph.addLink(currId,currId-1);
        }
        //if(nodeCount > 1)
        //{
        //  let currId = this.graph.nodesData.map(n => n.id)[nodeCount-1];
        //  this.graph.addLink(currId,currId-2);
        //}

      })
    });

  }

  queueTask(iAction)
  {
    this.graphTasks.push(iAction);
    if(this.processTick == null)
    {
      this.processTick = setTimeout(()=>{this.processGraphTask()},this.taskTempo);
    }
  }

  processGraphTask()
  {
    if(this.graphTasks.length === 0) 
    { 
      this.processTick = null;
      if(this.state = "uninit") 
      { 
        this.graph.addLink(0,this.graph.nodesData.length-1);
        this.graphInitDone();
      }
      return; 
    }

    this.graphTasks.shift()();
    this.processTick = setTimeout(()=>{this.processGraphTask()},this.taskTempo);
  }


  graphInitDone()
  {
    
    this.state = "init";
    this.graph.updateSimulation();
    console.log("init done!")
  }

  nodeClicked(iNode)
  {
    
    console.log(`polygam-graph click called`);
    console.log(iNode);
  }

});