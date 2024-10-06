// Load Google Charts for Flowchart
google.charts.load('current', {'packages':['orgchart']});
google.charts.setOnLoadCallback(drawFlowchart);

function drawFlowchart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Step');
    data.addColumn('string', 'Parent');
    data.addRows([
        [{v:'Concept', f:'<div class="node"><b>Concept</b><br>Idea & Vision</div>'}, ''],
        [{v:'Data Collection', f:'<div class="node"><b>Data Collection</b><br>Gathering</div>'}, 'Concept'],
        [{v:'Data Processing', f:'<div class="node"><b>Data Processing</b><br>Cleaning & Wrangling</div>'}, 'Data Collection'],
        [{v:'Model Building', f:'<div class="node"><b>Model Building</b><br>Training Models</div>'}, 'Data Processing'],
        [{v:'Evaluation', f:'<div class="node"><b>Evaluation</b><br>Testing & Validation</div>'}, 'Model Building'],
        [{v:'Deployment', f:'<div class="node"><b>Deployment</b><br>Integration & Scaling</div>'}, 'Evaluation'],
        [{v:'Monitoring', f:'<div class="node"><b>Monitoring</b><br>Feedback & Optimization</div>'}, 'Deployment']
    ]);

    var chart = new google.visualization.OrgChart(document.getElementById('steps-flowchart'));
    chart.draw(data, {'allowHtml':true});
}

// D3.js: Data Flow with Interactivity
const svg = d3.select("#data-flow"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const nodes = [
    { id: "Raw Data", group: 1 },
    { id: "Preprocessing", group: 2 },
    { id: "Model Training", group: 3 },
    { id: "Prediction", group: 4 },
    { id: "Deployment", group: 5 }
];

const links = [
    { source: "Raw Data", target: "Preprocessing", value: 1 },
    { source: "Preprocessing", target: "Model Training", value: 1 },
    { source: "Model Training", target: "Prediction", value: 1 },
    { source: "Prediction", target: "Deployment", value: 1 }
];

// Force simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Define link lines
const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .style("stroke", "#bbb")
    .style("stroke-width", 2)
    .on("mouseover", function() {
        d3.select(this).style("stroke-width", 5);
    })
    .on("mouseout", function() {
        d3.select(this).style("stroke-width", 2);
    });

// Define nodes as circles
const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 30)
    .style("fill", d => d.group === 1 ? "#4CAF50" : "#2196F3")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

// Add labels to the nodes
const label = svg.append("g")
    .selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("fill", "#333")
    .text(d => d.id);

// Simulation tick
simulation.on("tick", () => {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label.attr("x", d => d.x)
        .attr("y", d => d.y);
});

// Drag functions
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
