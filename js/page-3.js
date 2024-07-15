// "use strict"
async function init() {
var height = 500;
var width = 500;
var margin = 200;

// =============================================== DATA SELECTION =============================================
const data = await d3.csv("https://raw.githubusercontent.com/danielgrijalva/movie-stats/master/movies.csv");
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
// var moviesbyYear = d3.nest(data, d => d.year)


const new_data = d3.nest()
    .key(d => d.year)
    .rollup(values => values.length)
    .entries(data)
    .map(d => ({year: +d.key, num_movie: d.value}));

const xs = d3.scaleLinear().domain(d3.extent(new_data, d=>d.year)).range([0,width]);
const ys = d3.scaleLinear().domain([0, d3.max(new_data, d=>d.num_movie)]).range([height, 0]);
    
const line = d3.line()
    .x(function(d) {return xs(d.year);})
    .y(function(d) {return ys(d.num_movie);})
    .curve(d3.curveMonotoneX);


// ================================================================================================================

console.log("here", new_data)
// ============================================ CANVAS SETTINGS ====================================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .append('path')
    .datum(new_data)
    // .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

// ================== AXES ==================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", 0)")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+height+")")
    // .call(d3.axisBottom(xs).tickValues([1980,1990,2000,2010,2020]).tickFormat(d3.format(".3")));
    .call(d3.axisBottom(xs));
// ============================================


// ================================================================================================================


}

