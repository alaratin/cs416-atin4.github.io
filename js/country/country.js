// "use strict"
async function init() {
var height = 500;
var width = 500;
var margin = 100;

// =============================================== DATA SELECTION =============================================
const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
// ============================================================================================================



// Define a projection
const projection = d3.geoMercator()
                      .scale(150)
                      .translate([width / 2, height / 1.5]);


// Define a path generator
const path = d3.geoPath()
                .projection(projection);

// Load TopoJSON data
// d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(topology => {
//   // Convert TopoJSON to GeoJSON
//   const geojson = topojson.feature(topology, topology.objects.countries);
// // )


// ================================== EXTRACT DATA TO DISPLAY =======================================
// @ Filter data for Data Scientists
const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.work_year == '2022'); 
// const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE" && d.work_year == '2022'); 


const codeMap = {
  "US": "United States of America",
  "GB": "United Kingdom",
  "ES": "Spain",
  "IN": "India",
  "CA": "Canada",
  "IE": "Ireland",
  "AE": "United Arab Emirates",
  "PL": "Poland",
  "DE": "Germany",
  "GR": "Greece",
  "JP": "Japan",
  "DK": "Denmark",
  "BE": "Belgium",
  "FR": "France",
  "NL": "Netherlands",
  "JE": "Jersey",
  "BR": "Brazil",
  "NG": "Nigeria",
  "IQ": "Iraq",
  "RO": "Romania",
  "DZ": "Algeria",
  "PK": "Pakistan",
  "CH": "China",
  "HN": "Honduras",
  "TN": "Tunisia",
  "CZ": "Czechia",
  "PL": "Poland",
  "EE": "Estonia",
  "SI": "Slovenia",
  "PT": "Portugal",
  "AU": "Australia",
  "EG": "Egypt",
  "AT": "Austria",
  "TR": "Turkey",
  "IT": "Italy",
  "LV": "Latvia",
  "KE": "Kenya",
  "SG": "Singapore"
};
// const countryFullName = data.map(d => codeMap[d.company_location]);
const countryFullName = data_SE.map(d => ({
  company_location: codeMap[d.company_location]
}));


// // console.log(countryFullName)

// @ Group Data Scientists per year
// const grouped_data_SE =  Array.from(d3.group(data_SE, d => d.company_location),
// ([key, values]) => ({
//     country_loc: key,
//     country_cnt: values.length,
//     years: Array.from(d3.group(values, d => d.work_year),
//       ([year, year_val]) => ({
//         year: year,
//         year_cnt: year_val.length
//       })
//     )

// }));
// const grouped_data_SE =  Array.from(d3.group(data_SE, d => countryFullName),
const grouped_data_SE =  Array.from(d3.group(countryFullName, d => d.company_location),
      ([key, values]) => ({
          country_loc: key,
          country_cnt: values.length
      }));

console.log(grouped_data_SE)

const color = d3.scaleSequential(d3.interpolateWarm)
      .domain([0, d3.max(grouped_data_SE, d => d.country_cnt)]);

const countryDataMap = new Map(grouped_data_SE.map(d => [d.country_loc, d.country_cnt]));

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(topology => {
  const geojson = topojson.feature(topology, topology.objects.countries).features;

// ============================================ CANVAS SETTINGS ====================================================
d3.select("svg")
    .selectAll("path")
        .data(geojson)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "country")
        .style("fill", d => {
          const count = countryDataMap.get(d.properties.name) || 0;
          return count>0 ? color(count) : "#000";
        });

  d3.select('svg').selectAll(".country")
  .append("title")
  .text(d => {
    const count = countryDataMap.get(d.properties.name) || 0;
    return `${d.properties.name}: ${count} Data Scientist jobs in 2021`;
  });
});
// // =============================================== ANNOTATIONS ================================================
// // Features of the annotation ----------- SENIOR LEVEL -------------
// const annotations = [
//     // {
//     //     note: {
//     //         label: "Lowest salary with $87,071",
//     //         title: "Senior Level",
//     //         wrap: 100
//     //     },
//     //     type:d3.annotationCalloutCircle,
//     //     x: xs('2021'),
//     //     y: ys(70),
//     //     radius: 10,
//     //     raiduspadding: 20,
//     //     dy: -20,
//     //     dx: 10
//     // },
    
//     {
//         note: { 
//           title: "Equalization Period", 
//           lineType: "none", 
//           align: "middle",
//           wrap: 150
//         },
//         subject: {
//           height: height - margin.top - margin.bottom,
//           width: 100

//         //   width: width - margin.top
//         },
//         type: d3.annotationCalloutRect,
//         y: margin.top,
//         x: xs(2021),
//         disable: ["connector"], // doesn't draw the connector
//         //can pass "subject" "note" and "connector" as valid options
//       //   dx: (xs(new Date("6/1/2009")) - xs(new Date("12/1/2007")))/2,
//       //   data: { x: "12/1/2007"}
//       }
// ];
// // ----------------------------------------------------------------------
// const makeAnnotations = d3.annotation()
//             .annotations(annotations);

// // ==============================================================================================================
// // ================================================================================================================

// console.log("EN", grouped_data_EN)
// console.log("MI", grouped_data_MI)
// console.log("SE", grouped_data_SE)
// // ============================================ CANVAS SETTINGS ====================================================
// d3.select("svg")
//     .attr("width", width + 2*margin)
//     .attr("height", height + 2*margin)
    
//     .append("g")
//     .attr("transform", "translate("+margin+","+margin+")")
//     //  .call(makeAnnota    tions)

//     .selectAll('rect')
//     .data(grouped_data_EN)
//     .enter()
//     .append('rect')
//     .attr('x', function(d) {return xs(d.work_year);})
//     .attr('y', function(d) {return ys(d.remote);})
//     .attr('width', 20)
//     .attr('height', function(d) {return height - ys(d.remote);})
//     .attr('fill', 'red');


// d3.select("svg")
//     .attr("width", width + 2*margin)
//     .attr("height", height + 2*margin)
    
//     .append("g")
//     .attr("transform", "translate("+margin+","+margin+")")
//     //  .call(makeAnnotations)

//     .selectAll('rect')
//     .data(grouped_data_MI)
//     .enter()
//     .append('rect')
//     .attr('x', function(d) {return xs(d.work_year);})
//     .attr('y', function(d) {return ys(d.remote);})
//     .attr('width', 20)
//     .attr('height', function(d) {return height - ys(d.remote);})
//     .attr("transform", "translate("+20+", 0)")
//     .attr('fill', 'green');


// d3.select("svg")
//     .attr("width", width + 2*margin)
//     .attr("height", height + 2*margin)
    
//     .append("g")
//     .attr("transform", "translate("+margin+",0)")
//     //  .call(makeAnnotations)

//     .selectAll('rect')
//     .data(grouped_data_SE)
//     .enter()
//     .append('rect')
//     .attr('x', function(d) {return xs(d.work_year);})
//     .attr('y', function(d) {return ys(d.remote);})
//     .attr('width', 20)
//     .attr('height', function(d) {return height - ys(d.remote);})
//     .attr("transform", "translate("+40+", "+100+")")
//     .attr('fill', 'steelblue');
// // ================== AXES ==================
// d3.select("svg")
//     .append("g")
//     .attr("transform", "translate("+margin+", "+margin+")")
//     .call(d3.axisLeft(ys));

// d3.select("svg")
//     .append("g")
//     .attr("transform", "translate("+margin+", "+(height+margin)+")")
//     .call(d3.axisBottom(xs))
//     .selectAll('text') 
//     .attr("transform", "translate(10,20)rotate(25)")
//     .attr('fill', 'teal')

// // ============================================


// // ================================================================================================================


}

