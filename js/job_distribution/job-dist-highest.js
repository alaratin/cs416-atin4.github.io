// "use strict"
async function init() {
var height = 500;
var width = 500;
var margin = 100;
var xWidth = 400;

// =============================================== DATA SELECTION =============================================
const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
// ============================================================================================================

// ================================================= GROUPING ===================================================
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

grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));
// ===============================================================================================================
// ============================================= LINE CHART DEFINITION============================================

const xs = d3.scaleLinear().domain(d3.extent(grouped_data_SE, d=>d.work_year)).range([0,width]);
const ys = d3.scaleLinear().domain([0, d3.max(grouped_data_SE, d=>d.mean_salary)]).range([height, 0]);
    
const line = d3.line()
    .x(function(d) {return xs(d.work_year);})
    .y(function(d) {return ys(d.mean_salary);})
    .curve(d3.curveMonotoneX);

// ===============================================================================================================

console.log("En", grouped_data_EN)
console.log("MI", grouped_data_MI)
console.log("SE", grouped_data_SE)


// =============================================== ANNOTATIONS ================================================
var label_color= d3.color("brown").darker(); 
const annotations = [
    // {
    //     note: {
    //         label: "Lowest salary with $87,071.25",
    //         title: "Senior Level",
    //         wrap: 100
    //     },
    //     type:d3.annotationCalloutCircle,
    //     x: xs('2021'),
    //     y: ys(88071.25),
    //     subject:{
    //         radius: 10,
    //         raiduspadding: 5,
    //     },
    //     dy: -100,
    //     dx: 0,
    //     color: label_color
    // },
    {
        note: {
            label: "Highest salary with $81,272.45",
            title: "Entry Level",
            wrap: 100
        },
        type:d3.annotationCalloutCircle,
        x: xs('2022'),
        y: ys(81272.44827586207),
        subject:{
            radius: 10,
            raiduspadding: 5,
        },
        dy: 100,
        dx: 0,
        color: label_color
    },
    {
        note: {
            label: "Highest salary with $104,014.79",
            title: "Medium Level",
            wrap: 100
        },
        type:d3.annotationCalloutCircle,
        x: xs('2023'),
        y: ys(104014.78723404255),
        subject:{
            radius: 10,
            raiduspadding: 5,
        },
        dy: -50,
        dx: -50,
        color: label_color
    },

    {
        note: {
            label: "Highest salary with $172,916.25",
            title: "Senior Level",
            wrap: 100
        },
        type:d3.annotationCalloutCircle,
        x: xs('2020'),
        y: ys(172916.25),
        subject:{
            radius: 10,
            raiduspadding: 5,
        },
        dy: 25,
        dx: 75,
        color: label_color
    },
];
// ----------------------------------------------------------------------
const makeAnnotations = d3.annotation()
        .annotations(annotations);

// ==============================================================================================================

// ============================================ CANVAS SETTINGS ====================================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .call(makeAnnotations)

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


// ========================================== AXES SETTING ======================================================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+margin+")")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+(height+margin)+")")
    .call(d3.axisBottom(xs).tickValues([2020,2021,2022,2023]).tickFormat(d3.format("d")))
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 200)
    .attr("y", height + margin*1.5)
    .attr("transform", "translate(175,30)")
    .text("Work Years");
// ===============================================================================================================

// ========================================== AXES LABELING ======================================================
d3.select('svg').append("text")
          .attr("text-anchor", "end")
          .attr("x", 200)
          .attr("y", height + margin*1.2)
          .attr("transform", "translate(175,30)")
          .text("Work Years");

d3.select('svg').append("text")
          .attr("text-anchor", "end")
          .attr("x", 160)
          .attr("y", 80)
          .text("Mean Salary in USD ($)");
// ===============================================================================================================

}

