// "use strict"

async function init() {

  // @ Data Selection
  // const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
  window.data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
  getData(data)
}

// ===============================================================================================================
// =========================================== DATA SELECTION & GROUPING =========================================
// ===============================================================================================================
function getData(data, index=0){

    const year_arr = ['2020','2021', '2022', '2023']
    const year_val = year_arr[index]
    console.log(year_val)

    // @ Selected country is omitted due to having single datapoint in the dataset, causing inaccurate representation for 
    // mean salary display for the user.
    var data_SE = data.filter(d => d.job_title === "Data Scientist" && d.work_year === year_val && d.company_location !== "IL"); 
    
    const projection = d3.geoNaturalEarth1();

    // @ Path generatator for the drawing
    const path = d3.geoPath()
                    .projection(projection);

    // ======= NAME MAPPING ======== 
    const codeMap = {
      "AE": "United Arab Emirates",
      "AL": "Albania",
      "AM": "Armenia",
      "AR": "Argentina",
      "AS": "American Samoa",
      "AT": "Austria",
      "AU": "Australia",

      "BA": "Bosnia and Herzegovina",
      "BE": "Belgium",
      "BO": "Bolivia",
      "BR": "Brazil",
      "BS": "Bahamas",

      
      "CA": "Canada",
      "CF": "Central African Republic",
      "CH": "Switzerland",
      "CL": "Chile",
      "CN": "China",
      "CO": "Colombia",
      "CR": "Costa Rica",
      "CZ": "Czechia",

      "DE": "Germany",
      "DK": "Denmark",
      "DZ": "Algeria",

      "EE": "Estonia",
      "EG": "Egypt",
      "ES": "Spain",


      "FI": "Finland",
      "FR": "France",

      "GB": "United Kingdom",
      "GH": "Ghana",
      "GR": "Greece",

      "HK": "Hong Kong",
      "HN": "Honduras",
      "HR": "Crotia",
      "HU": "Hungary",

      "ID": "Indonesia",
      "IE": "Ireland",
      "IL": "Israel",
      "IN": "India",
      "IQ": "Iraq",
      "IR": "Iran",
      "IT": "Italy",

      "JP": "Japan",

      "KE": "Kenya",

      "LT": "Lithuania",
      "LU": "Luxembourg",
      "LV": "Latvia",

      "MA": "Morocco",
      "MD": "Moldova",
      "MK": "Macedonia",
      "MT": "Malta",
      "MX": "Mexico",
      "MY": "Malaysia",

      "NG": "Nigeria",
      "NL": "Netherlands",
      "NZ": "New Zealand",

      "PK": "Pakistan",
      "PL": "Poland",
      "PR": "Puerto Rico",
      "PT": "Portugal",

      "RO": "Romania",
      "RU": "Russia",

      "SE": "Sweden",
      "SG": "Singapore",
      "SI": "Slovenia",
      "SK": "Slovakia",

      "TH": "Thailand",
      "TR": "Turkey",
      "UA": "Ukraine",
      "US": "United States of America",
      "VN": "Vietnam"

    };
    // =============================

    const countryFullName = data_SE.map(d => ({
      company_location: codeMap[d.company_location],
      salary: d.salary_in_usd
    }));

  const grouped_data_SE =  Array.from(d3.group(countryFullName, d => d.company_location),
        ([key, values]) => ({
            country_loc: key,
            mean_salary: d3.mean(values, d => d.salary)
          }));

// =================================================================================================================

// =================================================================================================================
// ============================================== MAP COLORING =====================================================
// =================================================================================================================
const color = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(grouped_data_SE, d => d.mean_salary)]);

const countryDataMap = new Map(grouped_data_SE.map(d => [d.country_loc, d.mean_salary]));
console.log("COUNTRY",countryDataMap)

  if(!window.draw_flag){
    drawCanvas(countryDataMap,path,color, index)
    setTimeout(() => {getData(data, index + 1)},5000);
  }
  else{

    d3.select("svg").selectAll("path")
      .style("fill", d => {
        const salary = countryDataMap.get(d.properties.name) || 0;
        return salary>0 ? color(salary) : "#4b5563";    
      });
      
      const countryDataMap_filtered = new Map(Array.from(countryDataMap).filter
      (([key,value]) => value > 0).sort((a,b) => d3.descending(a[1], b[1])));
      console.log("COUNTRY-VERY",countryDataMap_filtered)


      d3.select("svg").selectAll(".legend").select("rect")
        .data(countryDataMap_filtered)
        .style("fill", ([name,value]) => {
          const salary = countryDataMap_filtered.get(name);
            return salary>0 ? color(salary) : "#000"
        });
      
        d3.select("svg").selectAll(".legend").select("text")
        .data(countryDataMap_filtered)

        .text(([name, value]) => "$" + countryDataMap_filtered.get(name).toFixed(2));
      

    
    setTimeout(() => {
        if (index == 3){
          index = -1;
          getData(data, index + 1);
        }
        else{ 
          getData(data, index + 1);
        }
      }, 5000)
  }


}

// ===============================================================================================================
// ================================================ DRAW & PLOT ==================================================
// ===============================================================================================================
function drawCanvas(countryDataMap, path, color, index){
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(topology => {
    const geojson = topojson.feature(topology, topology.objects.countries).features;
    d3.select("svg")
        .selectAll("path")
            .data(geojson)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country")
            .style("fill", d => {
              const salary = countryDataMap.get(d.properties.name) || 0;
              // return salary>0 ? color(salary) : "#818589";
              return salary>0 ? color(salary) : "#4b5563";
            });
  
    d3.select('svg')
      .selectAll(".country")
        .append("title")
        .text(d => {
          const count = countryDataMap.get(d.properties.name) || 0;
          return `Mean Salary for Data Scientist Job in ${d.properties.name}: $ ${count}`;
        });
     
  var width = 500;
  var height = 500;

  const countryDataMap_filtered = new Map(Array.from(countryDataMap).filter
  (([key,value]) => value > 0).sort((a,b) => d3.descending(a[1], b[1])));

  const legend = d3.select('svg').selectAll(".legend")
    .data(countryDataMap_filtered)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(15,"+(25*i)+")");

  legend.append("rect")
    .attr('x', width/2 - 150)
    .attr('y', 220)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", ([name,value]) => {
      const salary = countryDataMap_filtered.get(name);
        return salary>0 ? color(salary) : "#000"   
    });

  legend.append("text")
    .attr("x", width/2 - 130)
    .attr("y", 230)
    .attr("dy", ".10em")
    .style("text-anchor", "start")
    .text(([name, value]) => "$" + countryDataMap_filtered.get(name).toFixed(2));


  });

 
  // ===================================================================================================================
  // @ Clear svg for updating parameter
  // var svg = d3.select("svg");
  // svg.selectAll("*").remove();
  // ===================================================================================================================

  window.draw_flag = 'true';
}

