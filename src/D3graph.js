class D3Graph
{	
  constructor(iHostElement)
  {    
    this.svgWidth  = iHostElement.offsetWidth;
    this.svgHeight = iHostElement.offsetHeight;
    this.svgCenterX = iHostElement.offsetWidth / 2;
    this.svgCenterY = iHostElement.offsetHeight / 2;
    this.debug = false;
    
    // Create SVG handle
    this.svg = d3.select(iHostElement)
    .append("svg")
    .attr("width", this.svgWidth)
    .attr("height",this.svgHeight);
        
    // Default graph properties
    this.linksData = [];
    this.nodesData = [];
    this.nodeRadius = 20;
    this.manyBodyStrength = -200;
    this.centerForceRatio = 0.08;
    this.linkDistance = 50;
        
    // Create links structure
    this.svg.append("g").attr("class", "links");
    this.linksRef = this.svg.select(".links").selectAll(".link");

    // Create nodes structure
    this.svg.append("g").attr("class", "nodes");
    this.nodesRef = this.svg.select(".nodes").selectAll(".node");    
    

    // Init simulation
    this.simulation = d3.forceSimulation(this.nodesData)
      .force("charge", d3.forceManyBody().strength(this.manyBodyStrength))
      .force("link", d3.forceLink(this.linksData).distance(this.linkDistance))
      .force("forceX", d3.forceX().strength(this.centerForceRatio).x(this.svgCenterX))
      .force("forceY", d3.forceY().strength(this.centerForceRatio).y(this.svgCenterY))
      .alphaTarget(1)
      .on("tick", this.graphTick.bind(this));
      
  }  
  
  updateSimulation()
  {    
    // Update nodes
    this.nodesRef = this.nodesRef.data(this.nodesData);
    this.nodesRef.exit().remove();
    let newNodes = this.nodesRef.enter()
      .append("g")
      .attr("class", "node")
      .call(d3.drag()
            .on("start", this.graphDragstarted.bind(this))
            .on("drag", this.graphDragged.bind(this))
            .on("end", this.graphDragended.bind(this)))
      .append("g");
    
    // Setup node appearance in another function
    this.dressNewNodes(newNodes);
    this.nodesRef = newNodes.merge(this.nodesRef);  
    
    // Update links
    this.linksRef = this.linksRef.data(this.linksData);
    this.linksRef.exit().remove();
    
    let newLinks = this.linksRef.enter()
      .append("g")
      .attr("class", "link")
      .append("line")
      .attr("linkId", d => d.id);
    
    this.linksRef = newLinks.merge(this.linksRef);
    
    // Restart simulation
    this.simulation.nodes(this.nodesData);
    //this.simulation.force("link").links(this.linksData); //*** NOT SURE IF THIS IS REQUIRED ***
    this.simulation.force("link", d3.forceLink(this.linksData).id( d => d.id).distance(d => d.distance * this.linkDistance));
    this.simulation.restart();
  };  
  
  dressNewNodes(iSelection)
  {    
    // Node body
    iSelection.append("circle")
    .attr("r", this.nodeRadius)
    .attr("nodeId", d => d.id);  

    // Node text
    iSelection.append("text")
    .attr("class", "graph-text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("dominant-baseline", "central")
    .text(d => d.hasOwnProperty("name") ? d.name : d.id);

    // Node overlay
    iSelection.append("circle")
    .attr("r", this.nodeRadius)
    .attr("fill", "transparent")
    .attr("nodeId", d => d.id)
    .on("click", this.nodeClick);

        
  };  
  
  addNode (iNodeObject)
  {    
    
    if(iNodeObject.id === undefined) { 
      iNodeObject.id = this.nodesData.length === 0 ? 0 : Math.max.apply(Math, this.nodesData.map(n => n.id)) + 1; 
    }

    // Return if the node already exists
    if(this.nodesData.map(n => n.id).includes(iNodeObject.id)) { if(this.debug) { console.error(`Node ${iNodeObject.id} already exists`); } return; }    
    
    // Define a radius property if undefined
    if(iNodeObject.radius === undefined) { iNodeObject.radius = this.nodeRadius; }	
    // Define a default initial coordinates if undefined
    if(iNodeObject.cx === undefined) { iNodeObject.x = this.svgCenterX; }	
    if(iNodeObject.cy === undefined) { iNodeObject.y = this.svgCenterY; }	
    
    this.nodesData.push(iNodeObject);       
    this.updateSimulation();    
  };
  
  
  addLink (iSource, iTarget, iDistance = null) 
  {    
    let linkObject = {source: iSource, target: iTarget};

    // Return if the target or source node does not exist
    if (!this.nodesData.map(node => node.id).includes(linkObject.target)) { if(this.debug) {console.error(`Target node ${linkObject.target} does not exist`);} return; }
    if (!this.nodesData.map(node => node.id).includes(linkObject.source)) { if(this.debug) {console.error(`Source node ${linkObject.source} does not exist`);} return; }
    
        // Return is target is also the source
    if (linkObject.target === linkObject.source) { if(this.debug) {console.error("A link musk bind two different nodes");} return; }
    
    // Return if identical link already exists
    if(this.linksData.some(link => linkObject.target === link.target.id && linkObject.source === link.source.id)) 
    {if(this.debug) {console.error(`Link ${linkObject.source}-${linkObject.target} already exists`)}; return;}
    
    // Set distance
    linkObject.distance = iDistance != null ? iDistance : 1;

    // Set link id
    if (linkObject.id === undefined)     { linkObject.id = this.linksData.length === 0 ? 0 : Math.max.apply(Math, this.linksData.map(n => n.id)) + 1;  }    
    
    var sourceNode = this.nodesData.filter(n => n.id === iSource)[0];
    var targetNode = this.nodesData.filter(n => n.id === iTarget)[0];
    if(sourceNode && !sourceNode.hasOwnProperty("sourceLinks")) { sourceNode.sourceLinks = []; }
    if(targetNode && !targetNode.hasOwnProperty("targetLinks")) { targetNode.targetLinks = []; }
    
    sourceNode.sourceLinks.push(linkObject.id);
    targetNode.targetLinks.push(linkObject.id);
    
    this.linksData.push(linkObject);

    this.updateSimulation();    
  };  
  

  findLink (iSourceId, iTargetId)
  {
    // Return if link does not exist
    if(!this.linksData.map(link => `${link.source.id}-${link.target.id}`).includes(`${iSourceId}-${iTargetId}`)) 
    { if(this.debug) {console.error(`Link ${iSourceId}-${iTargetId} does not exist`);} return null; } 

    return this.linksData.filter(l => l.source.id === iSourceId && l.target.id === iTargetId)[0].id;
  };

  removeNode (iNodeId) 
  {
    // Return if the node does not exist
    if (!this.nodesData.map(n => n.id).includes(iNodeId)) { if(this.debug) {console.error(`Node ${iNodeId} does not exist`);} return; }

    // Identify all the links connected to this node
    let wNodeIsTarget = this.linksData.filter(link => link.target.id === iNodeId);
    let wNodeIsSource = this.linksData.filter(link => link.source.id === iNodeId);
    let wLinksToRemove = wNodeIsSource.concat(wNodeIsTarget);
    
    // Splice identified links from linksData
    wLinksToRemove.forEach(link => this.linksData.splice(this.linksData.map(l => l.source.id+"-"+l.target.id).indexOf(link.source.id+"-"+link.target.id), 1));
    
    // Remove from data
    let wIndexToRemove = this.nodesData.map(node => node.id).indexOf(iNodeId);
    this.nodesData.splice(wIndexToRemove,1);
    this.updateSimulation();    
  };    
  
  
  removeLink (iLinkSourceId, iLinkTargetId) 
  {
    // Return if link does not exist
    if(!this.linksData.map(link => `${link.source.id}-${link.target.id}`).includes(`${iLinkSourceId}-${iLinkTargetId}`)) 
    { if(this.debug) {console.error(`Link ${iLinkSourceId}-${iLinkTargetId} does not exist`);} return; } 
    
    // Remove link
    this.linksData
    .splice(this.linksData.map(link => `${link.source.id}-${link.target.id}`)
    .indexOf(`${iLinkSourceId}-${iLinkTargetId}`),1);
    
    // Remove links references of nodes
    this.nodesData.forEach(n => 
    {
      if(n.hasOwnProperty("sourceLinks") && n.sourceLinks.includes(iLinkSourceId))
      {
        n.sourceLinks.splice(n.sourceLinks.indexOf(iLinkSourceId),1);
      }

      if(n.hasOwnProperty("targetLinks") && n.targetLinks.includes(iLinkTargetId))
      {
        n.targetLinks.splice(n.targetLinks.indexOf(iLinkTargetId),1);
      }
    });
    
    this.updateSimulation(); 
  };
  
  
  graphTick (d) 
  {  
    this.nodesRef.attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    this.linksRef
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  };  
  
  graphDragstarted (d) 
  {
    if (!d3.event.active) this.simulation.alphaTarget(1).restart();
    d.fx = d.x;
    d.fy = d.y;
    

  };  
  
  graphDragged (d) 
  {
    d.fx = d3.event.x;    
    d.fy = d3.event.y;
  };  
  
  graphDragended (d) 
  {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  //  Callback  
  nodeClick(){}

}