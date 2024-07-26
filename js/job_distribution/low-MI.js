// "use strict"
async function init() {
    var height = 500;
    var width = 500;
    var margin = 100;
    
    // =============================================== DATA SELECTION =============================================
    // const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
    const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
    // ============================================================================================================
    var EN_flag = 1;
    var MI_flag = 1;
    var SE_flag = 0;
    console.log("flag-e",EN_flag)
    console.log("flag-m",MI_flag)
    console.log("flag-s",SE_flag)
    
    // if(EN_flag == 0 || MI_flag == 0 || SE_flag == 0){
    //     // const container = document.getElementById("canvas");
    //     // container.innerHTML = "";
    //     var svg = d3.select("svg");
    //     svg.selectAll("*").remove();
    // }
    
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
    const annotations_EN = [
        {
            note: {
                label: "Lowest salary with $54,983.33",
                title: "Entry Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2020'),
            y: ys(54983.33),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 75,
            dx: 45,
            color: label_color
        }
    ];
    const annotations_MI = [
        {
            note: {
                label: "Lowest salary with $71,256",
                title: "Medium Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2020'),
            y: ys(71256),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 75,
            dx: 150,
            color: label_color
        }
    ];
    
    const annotations_SE = [
        {
            note: {
                label: "Lowest salary with $87,071.25",
                title: "Senior Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2021'),
            y: ys(88071.25),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: -100,
            dx: 0,
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
                    makeAnnotations_EN, makeAnnotations_MI, makeAnnotations_SE, width, height, margin, line,xs,ys,
                        EN_flag, MI_flag, SE_flag )
    }
    
    // ==============================================================================================================
    // ============================================ CANVAS SETTINGS ====================================================
    // ================================= ENTRY_LEVEL EXP =================================
    function displayData(grouped_data_EN, grouped_data_MI, grouped_data_SE, 
                    makeAnnotations_EN, makeAnnotations_MI, makeAnnotations_SE, width, height, margin, line,xs,ys,
                        EN_flag, MI_flag, SE_flag)
    {
    if(EN_flag){
        d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(makeAnnotations_EN)
    
        .append('path')
        .datum(grouped_data_EN)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr('d', line);
    
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
        .attr("r", 2);
    
    }    
    else{
        console.log("no EN")
    }
    // ==================================================================================
    
    // ================================= MID_LEVEL EXP ==================================
    if(MI_flag){
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(makeAnnotations_MI)
    
        .append('path')
        .datum(grouped_data_MI)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 1.5)
        .attr('d', line)
    
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
    }
    else{
        console.log("no MI")
    }
    // ==================================================================================
    // ================================= SENIOR_LEVEL EXP ===============================
    if (SE_flag){
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(makeAnnotations_SE)
    
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
        .attr("r", 2)
    }
    else{
        console.log("no SE")
    }
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
                .attr("transform", (d, i) => "translate(15,"+(25*i)+")");
    
            legend.append("rect")
                .attr('x', width)
                .attr('y', height-40)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", d => d.color);
    
    
            legend.append("text")
                .attr("x", width + 30)
                .attr('y', height-32)
                // .attr("y", height-10)
                .attr("dy", ".30em")
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
    
    
    