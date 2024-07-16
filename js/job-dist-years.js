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
// const principal = data.filter(d => d.job_title.includes("Principal"));
const principal_FT = data.filter(d => d.job_title === "Principal Data Scientist" && d.employment_type === "FT");
const applied_FT = data.filter(d => d.job_title === "Applied Data Scientist" && d.employment_type === "FT");
const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE");
const data_MI = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "MI");
const data_EN = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EN");
    


const grouped_principal =  Array.from(d3.group(principal_FT, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

const grouped_applied =  Array.from(d3.group(applied_FT, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

const grouped_data =  Array.from(d3.group(data_FT, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

const grouped_data_2 =  Array.from(d3.group(data_CT, d => d.work_year),
([key, values]) => ({
    work_year: key,
    mean_salary: d3.mean(values, d => d.salary_in_usd)
}));

grouped_principal.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_applied.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_2.sort((a,b) => d3.ascending(a.work_year, b.work_year));

// const max_arr = Math.max(d3.max(grouped_data, d=>d.mean_salary), d3.max(grouped_data_2, d=>d.mean_salary))
const xs = d3.scaleLinear().domain(d3.extent(grouped_data, d=>d.work_year)).range([0,width]);
const ys = d3.scaleLinear().domain([0, d3.max(grouped_data, d=>d.mean_salary)]).range([height, 0]);
    
const line = d3.line()
    .x(function(d) {return xs(d.work_year);})
    .y(function(d) {return ys(d.mean_salary);})
    .curve(d3.curveMonotoneX);

// ================================================================================================================

console.log("here", grouped_principal)
console.log("here2", grouped_applied)
console.log("here3", grouped_data)
console.log("here4", grouped_data_2)
// ============================================ CANVAS SETTINGS ====================================================
// d3.select("svg")
//     .attr("width", width + 2*margin)
//     .attr("height", height + 2*margin)
    
//     .append("g")
//     .attr("transform", "translate("+margin+","+margin+")")
//     //  .call(makeAnnotations)

//     .append('path')
//     .datum(grouped_principal)
//     .attr("class", "line") 
//     .attr('fill', 'none')
//     .attr('stroke', 'black')
//     .attr('stroke-width', 1.5)
//     .attr('d', line);

d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .append('path')
    .datum(grouped_data)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .attr('d', line);

d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .append('path')
    .datum(grouped_data_2)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

// ================== AXES ==================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+margin+")")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+(height+margin)+")")
    // .call(d3.axisBottom(xs))
    .call(d3.axisBottom(xs).tickValues([2020,2021,2022,2023]).tickFormat(d3.format("d")));

    // .selectAll('text') 
    // .attr("transform", "translate(10,20)rotate(25)")
    // .attr('fill', 'teal')

// ============================================


// ================================================================================================================


}

