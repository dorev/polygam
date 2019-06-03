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
    //this.graph.debug = true;
    this.graph.nodeClick = this.nodeClicked.bind(this);

    
    tonnetze.filter(t => t.id > 11).forEach(chordData => 
    {
      this.queueTask(()=>
      {
        this.graph.addNode(chordData);

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
      if(this.state === "uninit") 
      { 
        // fluff
        this.graph.addLink(this.graph.nodesData[0].id, this.graph.nodesData[this.graph.nodesData.length-1].id);
        this.graph.addLink(this.graph.nodesData[0].id, this.graph.nodesData[this.graph.nodesData.length-2].id);
        this.graph.addLink(this.graph.nodesData[1].id, this.graph.nodesData[this.graph.nodesData.length-1].id);
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
    if( this.state !== "uninit" && this.state !== "init")
    {
      this.updateHighlighting();
    }
    
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
      
      // Highlight both directions if possible
      if(i > 0)
      {
        let linksId = []
        linksId.push(this.graph.findLink(this.progression[i-1].id, this.progression[i].id));
        linksId.push(this.graph.findLink(this.progression[i].id, this.progression[i-1].id));

        linksId.filter(id => id != null).forEach(id => 
        {
          this.graph.svg.selectAll(`.link [linkId='${id}']`)
          .attr("stroke","red")
          .attr("stroke-width","4");
        });        
      }
    }
  }
  
  clearGraph(exceptionId = -1)
  {
    var tempoAcceleration = 0.5;
    this.queueTask(() => { this.taskTempo /= tempoAcceleration; });

    // Remove all nodes
    this.graph.nodesData.map(n => n.id).filter(id => id != exceptionId).forEach(id =>
    {      
      this.queueTask(() => { this.graph.removeNode(id); });
    });  
  

    this.queueTask(() => { this.taskTempo *= tempoAcceleration; });
  }
  
  updateGraph()
  {
    switch(this.progression.length)    
    {
      case 0 : return;

      case 1 : 
      // FIRST NOTE
      this.clearGraph();
      this.queueTask(() => { this.state = "started"; }); 

      let newGraphElements = firstChordNeighbors(this.progression[0]);

      this.queueTask(() => { this.graph.simulation.alphaTarget(1); });    
      
      newGraphElements.scaleChords.forEach(node => 
      {
        this.queueTask(() => 
        { 
          this.graph.addNode(node); 
          this.graph.addLink(this.progression[0].id, node.id, 1.5);
        });
      });  
      
      newGraphElements.extendedChords.forEach(node => 
      {
        this.queueTask(() => 
        { 
          this.graph.addNode(node); 
          this.graph.addLink(this.progression[0].id, node.id, 3); 
        });
      });
      
      this.queueTask(() => 
      { 
        this.graph.simulation.alphaTarget(0); 
        this.updateHighlighting(); 
      });    
      
      

      // Tighten the link between 
      //
      //

       
      return;

      default :
      // PROGRESSION WITH AT LEAST 2 CHORDS
      // look behind to evaluate our most likely scales
      // remove nodes not belonging to these scales

      
      return;

    } // end of switch(this.progression.length) 


  } // end of updateGraph()


});