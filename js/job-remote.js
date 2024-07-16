// "use strict"
async function init() {
var height = 500;
var width = 500;
var margin = 100;

// =============================================== DATA SELECTION =============================================
const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
// ============================================================================================================

// =============================================== ANNOTATIONS ================================================
// Features of the annotation
// var annotations = data.map(d => ({
//     note: { label: `(${d.AverageCityMPG}, ${d.AverageHighwayMPG})` },
//     x: xs(d.AverageCityMPG),
//     y: ys(d.AverageHighwayMPG),
//     dx: 0.5,
//     dy: 0.5
// }));

// var makeAnnotations = d3.annotation().annotations(annotations);
// ==============================================================================================================

const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE");
const data_MI = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "MI");
const data_EN = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EN");
    
const grouped_data_SE =  Array.from(d3.group(data_SE, d => d.work_year),
([key, values]) => ({
    work_year: key,
    remote: d3.mean(values, d => d.remote_ratio)
}));
const grouped_data_MI =  Array.from(d3.group(data_MI, d => d.work_year),
([key, values]) => ({
    work_year: key,
    remote: d3.mean(values, d => d.remote_ratio)
}));

const grouped_data_EN =  Array.from(d3.group(data_EN, d => d.work_year),
([key, values]) => ({
    work_year: key,
    remote: d3.mean(values, d => d.remote_ratio)
}));
grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));

const xs = d3.scaleBand().domain(grouped_data_EN.map(d=>d.work_year)).range([0,width]).padding(0.5);
const ys = d3.scaleLinear().domain([0, d3.max(grouped_data_EN, d=>d.remote)]).range([height, 0]);


// ================================================================================================================

console.log("EN", grouped_data_EN)
console.log("MI", grouped_data_MI)
console.log("SE", grouped_data_SE)
// ============================================ CANVAS SETTINGS ====================================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .selectAll('rect')
    .data(grouped_data_EN)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.work_year);})
    .attr('y', function(d) {return ys(d.remote);})
    .attr('width', 20)
    .attr('height', function(d) {return height - ys(d.remote);})
    .attr('fill', 'red');


d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .selectAll('rect')
    .data(grouped_data_MI)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.work_year);})
    .attr('y', function(d) {return ys(d.remote);})
    .attr('width', 20)
    .attr('height', function(d) {return height - ys(d.remote);})
    .attr("transform", "translate("+20+", 0)")
    .attr('fill', 'green');


d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+",0)")
    //  .call(makeAnnotations)

    .selectAll('rect')
    .data(grouped_data_SE)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.work_year);})
    .attr('y', function(d) {return ys(d.remote);})
    .attr('width', 20)
    .attr('height', function(d) {return height - ys(d.remote);})
    .attr("transform", "translate("+40+", "+100+")")
    .attr('fill', 'steelblue');
// ================== AXES ==================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+margin+")")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+(height+margin)+")")
    .call(d3.axisBottom(xs))
    .selectAll('text') 
    .attr("transform", "translate(10,20)rotate(25)")
    .attr('fill', 'teal')

// ============================================


// ================================================================================================================


}

