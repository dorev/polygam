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
    this.taskTempo = 10;
    this.state = "uninit";
    this.progression = [];
    this.currentGraph = { nodes: [], links: []};

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
    this.progression.push({ id:iNode.id, root: iNode.root, voicing: iNode.voicing, name: iNode.name});

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
    let tempoAcceleration = 5;
    this.queueTask(() => { this.taskTempo /= tempoAcceleration; });

    // Remove all nodes
    this.graph.nodesData.map(n => n.id).filter(id => id != exceptionId).forEach(id =>
    {      
      this.queueTask(() => { this.graph.removeNode(id); });
    });  

    this.queueTask(() => { this.taskTempo *= tempoAcceleration; });
  }

  addNodeToCurrentGraph(iNode)
  {
    if(!this.currentGraph.nodes.map(n => n.id).includes(iNode.id))
    {
      this.currentGraph.nodes.push(iNode)
    }
  }

  addLinkToCurrentGraph(iLinkSource, iLinkTarget)
  {    
    if(!this.currentGraph
      .links
      .map(l => { return { source: l.id, target: l.id};})
      .includes(l => iLinkSource.id === l.source && iLinkTarget.id === l.target))
    {
      this.currentGraph.links.push({source: iLinkSource, target: iLinkTarget});
    }
  }
  
  updateGraph()
  {
    switch(this.progression.length)    
    {
      case 0 : return;

      case 1 : 
      // First chord has been selected
      this.clearGraph();
      this.queueTask(() => { this.state = "started"; }); 

      // Analyze and grab first set of chords
      let newGraphElements = firstChordNeighbors(this.progression[0]);

      // Warm up the graph
      this.queueTask(() => { this.graph.simulation.alphaTarget(1); });    
      
      // Add all new nodes
      newGraphElements.scaleChords.concat(newGraphElements.extendedChords).forEach(node => 
      {        
        this.queueTask(() => 
        { 
          this.graph.addNode(node); 
          
          // Add node to this.currentGraph
          this.addNodeToCurrentGraph(node);
        });
      });  

      // Add closer new links
      newGraphElements.scaleChords.forEach(node => 
      {        
        this.queueTask(() => 
        { 
          this.graph.addLink(this.progression[0].id, node.id, 1.5);
          this.addLinkToCurrentGraph(this.progression[0].id, node.id)
        });
      });  
      
      // Add farther new links
      newGraphElements.extendedChords.forEach(node => 
      {
        this.queueTask(() => 
        { 
          this.graph.addLink(this.progression[0].id, node.id, 3); 
          this.addLinkToCurrentGraph(this.progression[0].id, node.id)
        });
      });
      
      // Cool down the graph
      this.queueTask(() => 
      { 
        this.graph.simulation.alphaTarget(0); 
        this.updateHighlighting(); 
      });    
                   
      return;

      default :
      // PROGRESSION WITH AT LEAST 2 CHORDS
      
      let maxLookback = this.progression.length > 4 ? 4 : this.progression.length;

      // implement this.currentGraph update!!!
      let graphScales = nextGraph(this.progression, maxLookback, this.currentGraph);

      console.log("this.currentGraph :");
      console.log(this.currentGraph);
      console.log("graphScales :");
      console.log(graphScales);

      let nodesToAdd =  [];
      graphScales.forEach(scale => 
      {
        scale.scaleChords.forEach(chord =>
        {
          if(!nodesToAdd.map(n => n.id).includes(chord.id))
          {
            nodesToAdd.push(chord);
          }
        })
        scale.extendedChords.forEach(chord =>
        {
          if(!nodesToAdd.map(n => n.id).includes(chord.id))
          {
            nodesToAdd.push(chord);
          }
        })
        

      });
      console.log(nodesToAdd);

      // Add all new nodes
      nodesToAdd.forEach(node => 
      {        
        this.queueTask(() => 
        { 
          this.graph.addNode(node); 
          this.addNodeToCurrentGraph(node);
        });
      });  
      // display scales by linking all the related chords to their root
      
      // Add all new links
      // For each chord shown in the current graph...
      this.currentGraph.nodes.forEach(currentGraphNode =>
      {
        // Looking in the return of nextGraph()
        graphScales.forEach(scaleDescription =>
        {
          let scaleLinksToAdd = [];
          let normalLinkLength = 1.5;
          let extendedLinkLength = 3;

          // For each scale root found
          // Add chords belonging to scale with proper link distance
          if(scaleDescription.scaleChords.map(s => s.id).includes(currentGraphNode.id))
          {
            scaleDescription.scaleChords.forEach(scaleChord => 
            {

              if(!this.currentGraph.links.includes(currentGraphLink => 
                (currentGraphLink.source.id === currentGraphNode.id && currentGraphLink.target.id === scaleChord.id)
                || (currentGraphLink.source.id === scaleChord.id && currentGraphLink.target.id === currentGraphNode.id) ))
              {
                  this.queueTask(() => 
                  { 
                    console.log("Adding a liiink!");
                    
                    this.graph.addLink(currentGraphNode.id, scaleChord.id, normalLinkLength); 
                    this.graph.addLink(scaleChord.id, currentGraphNode.id, normalLinkLength); 
                    this.addLinkToCurrentGraph(scaleChord.id, currentGraphNode);

                  });
                }
            });  
          }
                    
          // Add chords belonging to extended scale with proper link distance
          if(scaleDescription.extendedChords.map(s => s.id).includes(currentGraphNode.id))
          {
            scaleDescription.extendedChords.forEach(extendedChord => 
            {
              if(!this.currentGraph.links.includes(currentGraphLink => 
                (currentGraphLink.source.id === currentGraphNode.id && currentGraphLink.target.id === extendedChord.id)
                || (currentGraphLink.source.id === extendedChord.id && currentGraphLink.target.id === currentGraphNode.id) ))
              {                  
                  this.queueTask(() => 
                  { 
                    this.graph.addLink(currentGraphNode.id, extendedChord.id, extendedLinkLength); 
                    this.graph.addLink(extendedChord.id, currentGraphNode.id, extendedLinkLength); 
                    this.addLinkToCurrentGraph(extendedChord.id, currentGraphNode);
                  });
                }
            });  
          }
          
        });
      });
      
             
      this.queueTask(() => 
      { 
        // DUPLICATED LINK IS ADDED!!!
        console.log(this.currentGraph);
      });
      // add nodes missing from current graph
      // compare and add missing linkgs
      
      return;

    } // end of switch(this.progression.length) 


  } // end of updateGraph()



});