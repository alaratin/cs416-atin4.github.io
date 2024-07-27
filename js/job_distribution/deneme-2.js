// "use strict"
async function init() {
    var height = 500;
    var width = 500;
    var margin = 100;
    
    // =============================================== DATA SELECTION =============================================
    // const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
    const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
    // ============================================================================================================
    var small_flag = document.querySelector('.small').checked;
    var mid_flag = document.querySelector('.mid').checked;
    var large_flag = document.querySelector('.large').checked;
    var all_flag = document.querySelector('.all').checked;

    var fifty_flag = document.querySelector('.fifty').checked;
    var hundred_flag = document.querySelector('.hundred').checked;
    var zero_flag = document.querySelector('.zero').checked;
    var all_remote = document.querySelector('.all_remo').checked;

    var us_flag = document.querySelector('.us').checked;
    // var can_flag = document.querySelector('.can').checked;
    // var ge_flag = document.querySelector('.ger').checked;
    var all_count = document.querySelector('.all_count').checked;
    
    
    // ================================================= GROUPING ===================================================
    // @ Selected country is omitted due to having single datapoint in the dataset, causing inaccurate representation for 
    // mean salary display for the user.
    // var data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE" && d.company_location !== "IL");
    // var data_MI = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "MI" && d.company_location !== "IL");
    // var data_EN = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EN" && d.company_location !== "IL");
    var data_SE = data.filter(d => d.experience_level === "SE" && d.company_location !== "IL");
    var data_MI = data.filter(d => d.experience_level === "MI" && d.company_location !== "IL");
    var data_EN = data.filter(d => d.experience_level === "EN" && d.company_location !== "IL");
    // ================================================= GROUPING ===================================================
    var svg = d3.select("svg");

    if(!all_flag){
        if(small_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_size == "S");
            data_MI = data_MI.filter(d=>d.company_size == "S");
            data_EN = data_EN.filter(d=>d.company_size == "S");
        }
        else if(mid_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_size == "M");
            data_MI = data_MI.filter(d=>d.company_size == "M");
            data_EN = data_EN.filter(d=>d.company_size == "M");
        }
        else if(large_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_size == "L");
            data_MI = data_MI.filter(d=>d.company_size == "L");
            data_EN = data_EN.filter(d=>d.company_size == "L");
        }
    }

    if(!all_remote){
        if(zero_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.remote_ratio == "0");
            data_MI = data_MI.filter(d=>d.remote_ratio == "0");
            data_EN = data_EN.filter(d=>d.remote_ratio == "0");
        }
        else if(fifty_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.remote_ratio == "50");
            data_MI = data_MI.filter(d=>d.remote_ratio == "50");
            data_EN = data_EN.filter(d=>d.remote_ratio == "50");
        }
        else if(hundred_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.remote_ratio == "100");
            data_MI = data_MI.filter(d=>d.remote_ratio == "100");
            data_EN = data_EN.filter(d=>d.remote_ratio == "100");
        }
    }

    if(!all_count){
        if(us_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_location == "US");
            data_MI = data_MI.filter(d=>d.company_location == "US");
            data_EN = data_EN.filter(d=>d.company_location == "US");
        }
        
    }
    if(all_count && all_remote && all_count){
        svg.selectAll("*").remove();
    }

    
        
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
    

    // console.log(MATH.max())
    grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    // ===============================================================================================================
    // ============================================= LINE CHART DEFINITION============================================
    const xs = d3.scaleLinear().domain(['2020','2023']).range([0,width]);
    var max_val_salary = d3.max([
                        d3.max(grouped_data_EN, d=>d.mean_salary),
                        d3.max(grouped_data_MI, d=>d.mean_salary),
                        d3.max(grouped_data_SE, d=>d.mean_salary)
    ]);
    const ys = d3.scaleLinear().domain([0, max_val_salary]).range([height, 0]);
        
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
    const annotations_EN = [
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
            dx: -25,
            color: label_color
        }
    ];
    const annotations_MI = [
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
        }
    ];
    
    const annotations_SE = [
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
        }
    ];
    // ----------------------------------------------------------------------
    const makeAnnotations_EN = d3.annotation()
            .annotations(annotations_EN);
    
    const makeAnnotations_MI = d3.annotation()
            .annotations(annotations_MI);
    const makeAnnotations_SE = d3.annotation()
            .annotations(annotations_SE);
    
    displayData(grouped_data_EN, grouped_data_MI, grouped_data_SE, 
                    makeAnnotations_EN, makeAnnotations_MI, makeAnnotations_SE, width, height, margin, line,xs,ys)
    }
    
    // ==============================================================================================================
    // ============================================ CANVAS SETTINGS ====================================================
    // ================================= ENTRY_LEVEL EXP =================================
    function displayData(grouped_data_EN, grouped_data_MI, grouped_data_SE, 
                    makeAnnotations_EN, makeAnnotations_MI, makeAnnotations_SE, width, height, margin, line,xs,ys)
    {
    const voronoi = d3.Delaunay
        .from(grouped_data_EN, d => xs(d.work_year), d => ys(d.mean_salary))
        .voronoi([0, 0, width, height]);

    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        // .call(makeAnnotations_EN)

        .append('path')
        .datum(grouped_data_EN)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
        .attr('d', line)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });


        // const tooltip = d3.select(".tooltip")
        const tooltip = d3.select("svg")
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .append("text")
            .attr("class", "tooltip")
            .attr("fill", "black")
            .style("pointer-events", "none");


    d3.select('svg')
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .selectAll(".dot")
        .data(grouped_data_EN)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", d => xs(d.work_year))
        .attr("cy", d => ys(d.mean_salary))
        .attr("r", 2.5)
        .on("mouseover", (evt, d) => {
            const [mx, my] = d3.pointer(evt);
            tooltip
              .attr("x", mx)
              .attr("y", my)
              .text(`$ ${d.mean_salary.toFixed(2)}`);
          });

    // ==================================================================================
    
    // ================================= MID_LEVEL EXP ==================================
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        // .call(makeAnnotations_MI)
    
        .append('path')
        .datum(grouped_data_MI)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 1.5)
        .attr('d', line);
    
    d3.select('svg')
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .selectAll(".dot")
        .data(grouped_data_MI)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", d => xs(d.work_year))
        .attr("cy", d => ys(d.mean_salary))
        .attr("r", 2);
    // ==================================================================================
    // ================================= SENIOR_LEVEL EXP ===============================
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        // .call(makeAnnotations_SE)
    
        .append('path')
        .datum(grouped_data_SE)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);
        
    d3.select('svg')
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .selectAll(".dot")
        .data(grouped_data_SE)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", d => xs(d.work_year))
        .attr("cy", d => ys(d.mean_salary))
        .attr("r", 2);

    // ==================================================================================
    // ============================== LEGENDS SETTINGS ==================================
    const legend_Dict = [
                        {color: "steelblue", label: "Senior Level Position"},
                        {color: "green", label: "Middle Level Position"},
                        {color: "red", label: "Entry Level Position"}];
    
    
    const legend = d3.select('svg').selectAll(".legend")
                .data(legend_Dict)
                .enter().append("g")
                .attr("class", "legend")
                // .attr("transform", (d, i) => "translate(15,"+(25*i)+")");
                .attr("transform", (d, i) => "translate("+(200*i)+",0)");
    
            legend.append("rect")
                .attr('x', width/2 - 150)
                // .attr('y', height-40)
                .attr('y', 40)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", d => d.color);
    
    
            legend.append("text")
                .attr("x", width/2 - 130)
                // .attr('y', height-32)
                .attr("y", 50)
                .attr("dy", ".10em")
                .style("text-anchor", "start")
                .text(d => d.label);
    // ==================================================================================
    
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
              .attr("y", 90)
              .text("Mean Salary in USD ($)");
    // ===============================================================================================================
    
    }
    
    
    