customElements.define("polygam-graph", class extends HTMLElement
{          
  
  constructor()
  {
    super();    
    
    //--------------------------------------------------------
    // Custom element members
    //--------------------------------------------------------    
    this.name = "graph";
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
      stroke: #AAA;
      stroke-width: 2px;
      opacity: 0.5;
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

  // Callback
  progressionChanged(){}

  initGraph()
  {
    this.graph = new D3Graph(this.container);
    //this.graph.debug = true;
    this.graph.nodeClick = this.nodeClicked.bind(this);

    this.graph.simulation.alpha(3);
    
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
    setTimeout(() =>(this.graph.simulation.alphaTarget(0)),2000);
  }

  

  nodeClicked(iNode)
  { 
    // Add node to progression
    this.progression.push({ id:iNode.id, root: iNode.root, voicing: iNode.voicing, name: iNode.name});
    this.progressionChanged(this);

    this.updateGraph();   
    if( this.state !== "uninit" && this.state !== "init")
    {
      this.updateHighlighting();
    }
    
  }

  
  updateHighlighting()
  {    
    // For each node of the progression,  find a link with the previous node and highlight it
    
    let selectedColor = "black";

    // Reset all nodes
    this.graph.svg.selectAll(`.node [stroke='${selectedColor}']`)
    .attr("stroke","black")
    .attr("stroke-width","1");    
    
    // Reset all links
    this.graph.svg.selectAll(`.link [stroke='${selectedColor}']`)
    .attr("stroke", "#AAA")
    .attr("stroke-width","2")
    .attr("opacity","0.5");

    for(let i = 0; i < this.progression.length; ++i)
    {
      let nodeId = this.progression[i].id;
      

      this.graph.svg.select(`.node [nodeId='${nodeId}']`)
      .attr("stroke",selectedColor)
      .attr("stroke-width","4");
      
      // Highlight both directions if possible
      if(i > 0)
      {
        let linksId = []
        linksId.push(this.graph.findLink(this.progression[i-1].id, this.progression[i].id));
        linksId.push(this.graph.findLink(this.progression[i].id, this.progression[i-1].id));


        linksId.filter(id => id != null).forEach(id => 
        {
          this.graph.svg.select(`.link [linkId='${id}']`)
          .attr("stroke", selectedColor)
          .attr("stroke-width","4")
          .attr("opacity","1");
        });        
      }
    }
  }
  
  clearGraph(exceptionId = -1)
  {
    let tempoAcceleration = 5;
    this.queueTask(() => { this.taskTempo /= tempoAcceleration; });

    // Remove all links
    this.graph.linksData.map(l => { return {source: l.source.id, target: l.target.id} }).forEach(link =>
    {      
      this.queueTask(() => { this.graph.removeLink(link.source, link.target); });
    });  

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
          this.graph.addLink(this.progression[0].id, node.id, 50);
          this.addLinkToCurrentGraph(this.progression[0].id, node.id)
        });
      });  
      
      // Add farther new links
      newGraphElements.extendedChords.forEach(node => 
      {
        this.queueTask(() => 
        { 
          this.graph.addLink(this.progression[0].id, node.id, 100); 
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

      let graphScales = nextGraph(this.progression, maxLookback, this.currentGraph).filter(scale => scale.voicing === "major");

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
          let normalLinkLength = 50;
          let extendedLinkLength = 100;
          let rootId = findChordTonnetzeId(scaleDescription.root, scaleDescription.voicing);

          // For each scale root found
          // Add chords belonging to scale with proper link distance
          if(scaleDescription.scaleChords.map(s => s.id).includes(currentGraphNode.id))
          {
            scaleDescription.scaleChords.forEach(scaleChord =>
            {
              // check if we already have a link between the root of the scale and that scaleChord
              if(!this.currentGraph.links.some(link => (link.source === scaleChord.id && link.target === rootId) 
                                                    || (link.source === rootId && link.target === scaleChord.id)))
              {
                this.queueTask(() => 
                {                     
                  this.graph.addLink(currentGraphNode.id, scaleChord.id, normalLinkLength); 
                  this.graph.addLink(scaleChord.id, currentGraphNode.id, normalLinkLength); 
                  this.addLinkToCurrentGraph(scaleChord.id, currentGraphNode.id);   
                });
              }
            }); 
          }
                    
          // Add chords belonging to extended scale with proper link distance
          if(scaleDescription.extendedChords.map(s => s.id).includes(currentGraphNode.id))
          {
            scaleDescription.extendedChords.forEach(extendedChord => 
            {
              // check if we already have a link between the root of the scale and that scaleChord
              if(!this.currentGraph.links.some(link => (link.source === extendedChord.id && link.target === rootId) 
                                                    || (link.source === rootId && link.target === extendedChord.id)))
              {
                this.queueTask(() => 
                {                     
                  this.graph.addLink(currentGraphNode.id, extendedChord.id, extendedLinkLength); 
                  this.graph.addLink(extendedChord.id, currentGraphNode.id, extendedLinkLength); 
                  this.addLinkToCurrentGraph(extendedChord.id, currentGraphNode.id);   
                });
              }
            });  
          }          
        });
      });        
    } // end of switch(this.progression.length) 
    
        
    this.queueTask(() => 
    { 
    // DUPLICATED LINK IS ADDED!!!
    //console.log(this.currentGraph);
    });

    // Send update to chord progression
    //this.progressionChanged(this);

  } // end of updateGraph()
  
  setProgression(iProgression)
  {
    let updatedProg = [];

    iProgression.forEach(chordElement => 
    {
      let chord = { id:null, root: null, voicing: null, name: null };

      chord.root = chordElement.root;
      chord.voicing = chordElement.voicing;
      chord.name = chordElement.name;
      chord.id = findChordTonnetzeId(chordElement.root, chordElement.voicing);
      updatedProg.push(chord);      
    });

    this.progression = updatedProg;

    this.updateHighlighting();
  }


});