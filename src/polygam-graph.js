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
    this.progression = [];

    //--------------------------------------------------------
    // CSS style
    //--------------------------------------------------------
    let style = document.createElement('style');
    style.textContent =`

    .graph-container
    {   
      place-self : stretch;
      min-height: 400px;
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

    line {
      transition: stroke 0.5s, stroke-width 0.5s;
      -webkit-transition: stroke 0.5s, stroke-width 0.5s;
    }

    circle {
      transition: stroke 0.5s, stroke-width 0.5s;
      -webkit-transition: stroke 0.5s, stroke-width 0.5s;
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
    this.graph = new D3Graph(this.container);
    this.graph.nodeClick = this.nodeClicked.bind(this);

    var graphInitialNodes = [
      {name: "C",   root: 0,  voicing: "major"},
      {name: "Cm",  root: 0,  voicing: "minor"},
      {name: "C#",  root: 1,  voicing: "major"},
      {name: "C#m", root: 1,  voicing: "minor"},
      {name: "D",   root: 2,  voicing: "major"},
      {name: "Dm",  root: 2,  voicing: "minor"},
      {name: "Eb",  root: 3,  voicing: "major"},
      {name: "Ebm", root: 3,  voicing: "minor"},
      {name: "E",   root: 4,  voicing: "major"},
      {name: "Em",  root: 4,  voicing: "minor"},
      {name: "F",   root: 5,  voicing: "major"},
      {name: "Fm",  root: 5,  voicing: "minor"},
      {name: "F#",  root: 6,  voicing: "major"},
      {name: "F#m", root: 6,  voicing: "minor"},
      {name: "G",   root: 7,  voicing: "major"},
      {name: "Gm",  root: 7,  voicing: "minor"},
      {name: "Ab",  root: 8,  voicing: "major"},
      {name: "Abm", root: 8,  voicing: "minor"},
      {name: "A",   root: 9,  voicing: "major"},
      {name: "Am",  root: 9,  voicing: "minor"},
      {name: "Bb",  root: 10, voicing: "major"},
      {name: "Bbm", root: 10, voicing: "minor"},
      {name: "B",   root: 11, voicing: "major"},
      {name: "Bm",  root: 11, voicing: "minor"}
    ].forEach(chordData => 
    {
      this.queueTask(()=>
      {
        this.graph.addNode({name:chordData.name, root:chordData.root, voicing: chordData.voicing });

        let nodeCount = this.graph.nodesData.length;
        
        // fluff
        if(nodeCount > 1)
        {
          let currId = this.graph.nodesData.map(n => n.id)[nodeCount-1];
          this.graph.addLink(currId,currId-1);
        }
        if(nodeCount > 2)
        {
          let currId = this.graph.nodesData.map(n => n.id)[nodeCount-1];
          this.graph.addLink(currId,currId-2);
        }

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
        // fluff
        this.graph.addLink(0,this.graph.nodesData.length-1);
        this.graph.addLink(0,this.graph.nodesData.length-2);
        this.graph.addLink(1,this.graph.nodesData.length-1);
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
    this.graph.simulation.alphaTarget(0);
  }

  

  nodeClicked(iNode)
  { 
    // Add node to progression
    this.progression.push({ id:iNode.id, root: iNode.root, voicing: iNode.voicing });

    this.updateGraph();    
    this.updateHighlighting();
  }

  
  updateHighlighting()
  {    
    // For each node of the progression,  find a link with the previous node and highlight it
    for(let i = 0; i < this.progression.length; ++i)
    {
      let nodeId = this.progression[i].id;
      
      this.graph.svg.selectAll(`.node [nodeId='${nodeId}']`)
      .attr("stroke","red")
      .attr("stroke-width","4");
      
      // If we're not the first node, highlight link with previous
      if(i > 0)
      {
        var linkId = this.graph.findLink(this.progression[i-1].id, this.progression[i].id);
        if(linkId === null)
        {
          linkId = this.graph.findLink(this.progression[i].id, this.progression[i-1].id);
        }
        
        // If no link exists between the nodes
        if(linkId === null)
        {
          console.log(`No link exists between node ${this.progression[i].id} and node ${this.progression[i-1].id}`);
          continue;
        }
        
        this.graph.svg.selectAll(`.link [linkId='${linkId}']`)
        .attr("stroke","red")
        .attr("stroke-width","4");
      }
    }
  }
  
  
  updateGraph()
  {
    //
    switch(this.progression.length)    
    {
      case 0 : return;

      case 1 : 
      // FIRST NOTE
      let newGraphElements = firstChordNeighbors(this.progression[0]);


      // consider the 1st note being the I or V or VI
      // identify the chords of these scales
        // add I-IV-V of the said chords as first layer
        // add brighter/darker chords
        // add IV/V and V/V of IV and V
        // add major/minor potential borrowings      
      return;

      default :
      // PROGRESSION WITH AT LEAST 2 CHORDS
      // look behind to evaluate our most likely scales
      // remove nodes not belonging to these scales

      
      return;

    }


  }


});