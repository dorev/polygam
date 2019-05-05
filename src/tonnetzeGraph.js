class TonnetzeGraph
{	
  constructor(iSvgSelection)
  {    
    this.svgWidth  = iSvgSelection._groups[0][0].offsetWidth;
    this.svgHeight = iSvgSelection._groups[0][0].offsetHeight;    
    this.svgCenterX = this.svgWidth/2;
    this.svgCenterY = this.svgHeight/2;
    
    // Create SVG handle
    this.svg = iSvgSelection
      .append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);
        
    // Default graph properties
    this.links = [];
    this.nodes = [];
    this.nodeRadius = 10;
    this.manyBodyStrength = -1000;
    this.centerForceRatio = 0.05;
    this.linkDistance = 50;
        
    // Create links structure
    this.svg.append("g").attr("class", "links");
    this.linksRef = this.svg.select(".links").selectAll(".link");

    // Create nodes structure
    this.svg.append("g").attr("class", "nodes");
    this.nodesRef = this.svg.select(".nodes").selectAll(".node");    
    

    // Init simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody().strength(this.manyBodyStrength))
      .force("link", d3.forceLink(this.links).distance(this.linkDistance))
      .force("forceX", d3.forceX().strength(this.centerForceRatio).x(this.svgCenterX))
      .force("forceY", d3.forceY().strength(this.centerForceRatio).y(this.svgCenterY))
      .alphaTarget(1)
      .on("tick", this.graphTick.bind(this));
      
  }  
  
  updateSimulation()
  {    
    // Update nodes
    this.nodesRef = this.nodesRef.data(this.nodes, d => d.id);
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
    this.linksRef = this.linksRef.data(this.links, d => `${d.source.id}-${d.target.id}`);
    this.linksRef.exit().remove();
    
    let newLinks = this.linksRef.enter()
      .append("g")
      .attr("class", "link")
      .append("line");
    
    // Setup link appearance in another function *** TO DO ***
    //this.dressNewLinks(newLinks);
    this.linksRef = newLinks.merge(this.linksRef);
    
    // Restart simulation
    this.simulation.nodes(this.nodes);
    this.simulation.force("link", d3.forceLink(this.links).id( d => d.id).distance(d => d.weight * this.linkDistance));
    this.simulation.alpha(1).alphaTarget(0).restart();
  };  
  
  dressNewNodes(iSelection)
  {    
    iSelection.append("circle").attr("r", d => d.radius);    
    iSelection.append("text")
      .attr("x", 0) 
      .attr("y", d => d.radius/2) 
      .attr("text-anchor", "middle") 
      .text(d => d.name);
    iSelection.append("circle")
      .attr("r", this.nodeRadius+1)
      .attr("class", "clickOverlay")
      .attr("opacity", 0)
      .attr("nodeId", d => d.id)
      .attr("nodeName", d => d.name);
  };
  
  /* TO DO
  dressNewLinks(iSelection)
  {  
  };
  */
  
  addNode (iNodeObject)
  {    
    // Return if the node already exists
    if(this.nodes.map(n => n.id).includes(iNodeObject.id)) { console.error(`Node ${iNodeObject.id} already exists`); return; }    
    
    // Define a default properties
    if(!iNodeObject.hasOwnProperty("radius")) { iNodeObject.radius = this.nodeRadius; }	
    if(!iNodeObject.hasOwnProperty("name")) { iNodeObject.name = ""; }	
    if(!iNodeObject.hasOwnProperty("x")) { iNodeObject.x = Math.random() * this.svgWidth; }	
    if(!iNodeObject.hasOwnProperty("y")) { iNodeObject.y = Math.random() * this.svgHeight; }	
    
    this.nodes.push(iNodeObject);       
    this.updateSimulation();    
  };
  
  
  addLink (iLinkObject) 
  {    
    // Return if the target or source node does not exist
    if (!this.nodes.map(node => node.id).includes(iLinkObject.target)) { console.error(`Target node ${iLinkObject.target} does not exist`); return; }
    if (!this.nodes.map(node => node.id).includes(iLinkObject.source)) { console.error(`Source node ${iLinkObject.source} does not exist`); return; }

    // Return is target is also the source
    if (iLinkObject.target === iLinkObject.source) { console.error("A link musk bind two different nodes"); return; }

    // Return if identical link already exists
    if(this.links.some(link => iLinkObject.target === link.target.id && iLinkObject.source === link.source.id)) 
    {console.error(`Link ${iLinkObject.source}-${iLinkObject.target} already exists`); return;}

    // Define a weight property if undefined
    if (iLinkObject.weight === undefined) { iLinkObject.weight = 1; }

    this.links.push(iLinkObject);
    this.updateSimulation();    
  };  
  
  
  removeNode (iNodeId) 
  {
    // Return if the node does not exist
    if (!this.nodes.map(n => n.id).includes(iNodeId)) { console.error(`Node ${iNodeId} does not exist`); return; }

    // Identify all the links connected to this node
    let wNodeIsTarget = this.links.filter(link => link.target.id === iNodeId);
    let wNodeIsSource = this.links.filter(link => link.source.id === iNodeId);
    let wLinksToRemove = wNodeIsSource.concat(wNodeIsTarget);
    
    // Splice identified links from links
    wLinksToRemove.forEach(link => this.links.splice(this.links.map(l => l.source.id+"-"+l.target.id).indexOf(link.source.id+"-"+link.target.id), 1));
    
    // Remove from data
    let wIndexToRemove = this.nodes.map(node => node.id).indexOf(iNodeId);
    this.nodes.splice(wIndexToRemove,1);        
    this.updateSimulation();    
  };    
  
  
  removeLink (iLinkSourceId, iLinkTargetId) 
  {
    // Return if link does not exist
    if(!this.links.map(link => `${link.source.id}-${link.target.id}`).includes(`${iLinkSourceId}-${iLinkTargetId}`)) 
    {console.error(`Link ${iLinkSourceId}-${iLinkTargetId} does not exist`); return;}
    
    // Remove link
    this.links.splice(this.links.map(link => `${link.source.id}-${link.target.id}`).indexOf(`${iLinkSourceId}-${iLinkTargetId}`),1);    
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

}
