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
      {name: "C",   root: 0,  voicing: "major", id:},  // load all chords from tonnetze instead!!!
      {name: "Cm",  root: 0,  voicing: "minor", id:},  // add chord names to tonnetze
      {name: "C#",  root: 1,  voicing: "major", id:},
      {name: "C#m", root: 1,  voicing: "minor", id:},
      {name: "D",   root: 2,  voicing: "major", id:},
      {name: "Dm",  root: 2,  voicing: "minor", id:},
      {name: "Eb",  root: 3,  voicing: "major", id:},
      {name: "Ebm", root: 3,  voicing: "minor", id:},
      {name: "E",   root: 4,  voicing: "major", id:},
      {name: "Em",  root: 4,  voicing: "minor", id:},
      {name: "F",   root: 5,  voicing: "major", id:},
      {name: "Fm",  root: 5,  voicing: "minor", id:},
      {name: "F#",  root: 6,  voicing: "major", id:},
      {name: "F#m", root: 6,  voicing: "minor", id:},
      {name: "G",   root: 7,  voicing: "major", id:},
      {name: "Gm",  root: 7,  voicing: "minor", id:},
      {name: "Ab",  root: 8,  voicing: "major", id:},
      {name: "Abm", root: 8,  voicing: "minor", id:},
      {name: "A",   root: 9,  voicing: "major", id:},
      {name: "Am",  root: 9,  voicing: "minor", id:},
      {name: "Bb",  root: 10, voicing: "major", id:},
      {name: "Bbm", root: 10, voicing: "minor", id:},
      {name: "B",   root: 11, voicing: "major", id:},
      {name: "Bm",  root: 11, voicing: "minor", id:}
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
  
  clearGraph(exceptionId = -1)
  {
    var tempoAcceleration = 2;
    this.queueTask(() => { this.taskTempo /= tempoAcceleration; });

    // Remove all nodes
    this.graph.nodesData.map(n => n.id).filter(id => id != exceptionId).forEach(id =>
    {      
      this.queueTask(() => { this.graph.removeNode(id); }); // some minor error occurs in here...
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
      let newGraphElements = firstChordNeighbors(this.progression[0]);
      console.log(newGraphElements);

      this.queueTask(() => { this.graph.simulation.alphaTarget(1); });    
      
      newGraphElements.scaleChords.forEach(node => 
      {
        this.queueTask(() => { this.graph.addNode(node); this.graph.addLink(this.progression[0].id, node.id, 1.5) });
      });  
      
      newGraphElements.extendedChords.forEach(node => 
      {
        this.queueTask(() => { this.graph.addNode(node); this.graph.addLink(this.progression[0].id, node.id, 3) });
      });

  //newGraphElements.links.forEach(link => 
  //{
    //// find current graph node id with name [source]
    //// find current graph node id with name [target]
    //
    //this.queueTask(() => 
    //{ 
    //  //console.log(`source ${link.source}   target ${link.target}`);
    //  //console.log(this.graph.nodesData.find(node => node.name === link.source));
    //  //console.log(this.graph.nodesData.find(node => node.name === link.target));
    //  var sourceId = this.graph.nodesData.find(node => node.name === link.source).id;
    //  var targetId = this.graph.nodesData.find(node => node.name === link.target).id;
    //  this.graph.addLink(sourceId, targetId); 
    //});
  //});
      
      this.queueTask(() => 
      { 
        this.graph.simulation.alphaTarget(0); 
        this.updateHighlighting(); 
        console.log(this.graph.nodesData)
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

    }


  }


});