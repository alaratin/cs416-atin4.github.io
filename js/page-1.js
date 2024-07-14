// "use strict"
async function init() {
var height = 100;
var width = 100;
var margin = 50;

var xs = d3.scaleLog().domain([10,150]).range([0,width]);
var ys = d3.scaleLog().domain([10,150]).range([height,0]);

const data = await d3.csv("https://flunky.github.io/cars2017.csv");

// Features of the annotation
var annotations = data.map(d => ({
    note: { label: `(${d.AverageCityMPG}, ${d.AverageHighwayMPG})` },
    x: xs(d.AverageCityMPG),
    y: ys(d.AverageHighwayMPG),
    dx: 0.5,
    dy: 0.5
}));

var makeAnnotations = d3.annotation().annotations(annotations);


d3.select("svg")
 .attr("width", width + 2*margin)
 .attr("height", height + 2*margin)
 
 .append("g")
 .attr("transform", "translate("+margin+","+margin+")")
 .call(makeAnnotations)

 .selectAll("dot")
 .data(data)
 .enter()
 .append("circle")
 .attr("cx", function(d) {return xs(d.AverageCityMPG);})
 .attr("cy", function(d) {return ys(d.AverageHighwayMPG);})
 .attr("r", function(d) {return 2+ Number(d.EngineCylinders);});


d3.select("svg")
 .append("g")
 .attr("transform", "translate("+margin+","+margin+")")
 .call(d3.axisLeft(ys).tickValues([10,20,50,100]).tickFormat(d3.format("~s")));

d3.select("svg")
 .append("g")
 .attr("transform", "translate("+margin+","+(height+margin)+")")
 .call(d3.axisBottom(xs).tickValues([10,20,50,100]).tickFormat(d3.format("~s")));


}

