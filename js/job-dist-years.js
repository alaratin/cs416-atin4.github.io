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




// ========================================== LINE CHART DEFINITION ==============================================
const data_EX = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EX");
const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE");
const data_MI = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "MI");
const data_EN = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EN");
    
const grouped_data_SE =  Array.from(d3.group(data_SE, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

const grouped_data_MI =  Array.from(d3.group(data_MI, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

const grouped_data_EN =  Array.from(d3.group(data_EN, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

const grouped_data_EX =  Array.from(d3.group(data_EX, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

grouped_data_EX.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));

// const max_arr = Math.max(d3.max(grouped_data, d=>d.mean_salary), d3.max(grouped_data_2, d=>d.mean_salary))
const xs = d3.scaleLinear().domain(d3.extent(grouped_data_SE, d=>d.work_year)).range([0,width]);
const ys = d3.scaleLinear().domain([0, d3.max(grouped_data_SE, d=>d.mean_salary)]).range([height, 0]);
    
const line = d3.line()
    .x(function(d) {return xs(d.work_year);})
    .y(function(d) {return ys(d.mean_salary);})
    .curve(d3.curveMonotoneX);

// ===============================================================================================================

console.log("here1", grouped_data_EN)
console.log("here2", grouped_data_MI)
console.log("here3", grouped_data_SE)
console.log("here4", grouped_data_EX)

// ============================================ CANVAS SETTINGS ====================================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .append('path')
    .datum(grouped_data_EN)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 1.5)
    .attr('d', line);

d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .append('path')
    .datum(grouped_data_MI)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 1.5)
    .attr('d', line);

d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .append('path')
    .datum(grouped_data_SE)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

// d3.select("svg")
//     .attr("width", width + 2*margin)
//     .attr("height", height + 2*margin)
    
//     .append("g")
//     .attr("transform", "translate("+margin+","+margin+")")
//     .append('path')
//     .datum(grouped_data_EX)
//     .attr("class", "line") 
//     .attr('fill', 'none')
//     .attr('stroke', 'black')
//     .attr('stroke-width', 1.5)
//     .attr('d', line);
// ================== AXES ==================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+margin+")")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+(height+margin)+")")
    .call(d3.axisBottom(xs).tickValues([2020,2021,2022,2023]).tickFormat(d3.format("d")));
// ============================================


// ================================================================================================================


}

