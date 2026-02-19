// #region SETUP
d3.select("#main")
    .append("h1")
    .text("Options to Vote Before Election Day, 2000-2024")

var yearList = [
    {option: "All Years",
        index: 0,
        years: [{year: 2000}, {year: 2002}, {year: 2004}, {year: 2006},
            {year: 2008}, {year: 2010}, {year: 2012}, {year: 2014}, {year: 2016}, 
            {year: 2018}, {year: 2020}, {year: 2022}, {year: 2024}, {year: 2026}]},
    {option: "Midterm Years",
        index: 1,
        years: [{year: 2002}, {year: 2006}, {year: 2010},
            {year: 2014}, {year: 2018}, {year: 2022}, {year: 2026}]},
    {option: "Presidential Years",
        index: 2,
        years: [{year: 2000}, {year: 2004}, {year: 2008},
            {year: 2012}, {year: 2016}, {year: 2020}, {year: 2024}]}
]

var width = 1000;
var height = 600;

var svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(0, 0)")

var colorScale = d3.scaleOrdinal()
    .domain([0, 1])
    .range(["#3b9171","#efc55b", "#ef7f4d"]);

var xScale = d3.scaleLinear()
    .domain([2000, 2026])
    .range([270, width-20]);

// #endregion

// #region LEGEND

var legend = svg.append("g")
    .attr("id", "legend")

// legend
//     .selectAll("rect")
//     .data([
//         "Options to vote early-in person and by mail available to all voters.",
//         "Option to vote early in-person available to all voters. Eligible reason required to vote by mail.",
//         "No early in-person voting option available to all voters. Eligible reason required to vote by mail."
//     ])
//     .enter()
//     .append("rect")
//         .attr("fill", (d, i) => colorScale(d))
//         .attr("width", 20)
//         .attr("height", 20)
//         .attr("x", 10)
//         .attr("y", (d, i) => i * 40 + 200)

// legend
//     .selectAll("text")
//     .data([
//         "Options to vote early-in person and by mail available to all voters.",
//         "Option to vote early in-person available to all voters. Eligible reason required to vote by mail.",
//         "No early in-person voting option available to all voters. Eligible reason required to vote by mail."
//     ])
//     .enter()
//     .append("text")
//         .text(d => d)
//         .attr("x", 35)
//         .attr("y", (d, i) => i * 40 + 215)
//         .attr("width", 100)


// #endregion

// #region SELECTION MENU

var selectionBarSelected = false; // tracks whether the dropdown menu is down
var selectionIndex = 0; // tracks which option is selected

// main selection bar
var selectionContainer = svg.append("g")
    .attr("id", "selection-container")

var selectionBar = selectionContainer.append("rect")
    .attr("width", 150)
    .attr("height", 25)
    .attr("x", 2)
    .attr("y", 10)
    .attr("fill", "#ebebeb")
    .on("mouseover", function() {
        d3.select(this)
            .style("stroke", "#243a76")
            .style("stroke-width", 0.7)
            .style("cursor", "pointer");
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("stroke-width", 0);
    })
    .on("click", function() {
        if (!selectionBarSelected) {
            selections.attr("opacity", 1)
            selectionsText.attr("opacity", 1)
            selectionBarSelected = true;
        } else {
            selections.attr("opacity", 0)
            selectionsText.attr("opacity", 0)
            selectionBarSelected = false;
        }
    })

var selectionBarText = selectionContainer.append("text")
    .text("All Years")
    .attr("fill", "black")
    .attr("x", 10)
    .attr("y", 27)

// dropdown options
var selectionOptions = selectionContainer.append("g")
    .attr("id", "selection-options")

var selections = selectionOptions
    .selectAll("rect")
    .data(yearList)
    .enter()
    .append("rect")
    .attr("width", 150)
    .attr("height", 25)
    .attr("x", 2)
    .attr("y", (d, i) => (i + 1) * 25 + 10)
    .attr("fill", "#ebebeb")
    .attr("opacity", 0)
    .on("mouseover", function() {
        if (selectionBarSelected) {
            d3.select(this)
                .style("stroke", "#243a76")
                .style("stroke-width", 0.7)
                .style("cursor", "pointer");
        }
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("stroke-width", 0);
    })

var selectionsText = selectionOptions
    .selectAll("text")
    .data(yearList)
    .enter()
    .append("text")
    .text(d => d.option)
    .attr("y", (d, i) => (i + 1) * 27 + 27)
    .attr("x", 10)
    .attr("fill", "black")
    .attr("opacity", 0)
    .attr("font-size", "12px")

// #endregion

// #region YEAR TIMELINE
var yearTimeline = svg.append("g")
    .attr("id", "year-timeline")

// rect connecting years
var yearRect = yearTimeline
    .append("rect")
    .attr("id", d => "year-rect")
    .attr("x", d => xScale(2000))
    .attr("y", 20)
    .attr("width", d => xScale(2026) - xScale(2000))
    .attr("height", 2)
    .attr("fill", "#bebebe");

// circles for each year 
var yearOptions = yearTimeline
    .append("g")
    .attr("id", "year-options")
    .selectAll("circle")
    .data(yearList[0].years)
    .enter()
    .append("circle")
        .attr("id", d => "circle-" + d.year)
        .attr("cx", d => xScale(d.year))
        .attr("cy", 20)
        .attr("r", 10)
        .style("fill", "#bebebe")
        .classed("presidential", d => (d.year - 2000) % 4 == 0)
        .classed("midterm", d => (d.year - 2000) % 4 != 0);

// add text below circles
var yearLabels = yearTimeline
    .append("g")
    .attr("id", "year-labels")
    .selectAll("text")
    .data(yearList[0].years)
    .enter()
    .append("text")
        .text(d => d.year)
        .attr("x", d => xScale(d.year))
        .attr("y", 50)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .classed("presidential", d => (d.year - 2000) % 4 == 0)
        .classed("midterm", d => (d.year - 2000) % 4 != 0);

let yearSelect = 0; // tracks year option selected (all, presidential, midterm)

// #endregion

// #region PLAY AND PAUSE BUTTONS
var playButton = svg.append("g")
    .attr("id", "play-button")
    .append("path")
        .attr("id", "play")
        .attr("d", "M0,0 L8,5 L0,10 L0,0")
        .attr("fill", "#bebebe")
        .attr("transform", "translate(180, 10.1) scale(2.3)")
    .on("mouseover", function(event, d) {
        d3.select(this)
            .style("stroke", "#243a76")
            .style("stroke-width", 0.3)
            .style("cursor", "pointer");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .style("stroke-width", 0);
    });

// pause button
var pauseButton = svg.append("g")
    .attr("id", "pause-button")
    .append("path")
        .attr("id", "pause")
        .attr("d", "M0,0 L0,10 L2,10 L2,0 L0,0 M4,0 L4,10 L6,10 L6,0 L4,0")
        .attr("fill", "#bebebe")
        .attr("transform", "translate(220, 10.1) scale(2.3)")
    .on("mouseover", function(event, d) {
        d3.select(this)
            .style("stroke", "#243a76")
            .style("stroke-width", 0.3)
            .style("cursor", "pointer");
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .style("stroke-width", 0);
    });

// #endregion

// legend

// keeps track of the current year selected
let currYear = 0;


// load data
Promise.all([
    d3.csv("VBED_temp.csv"),
    d3.json("tile_map.json")
]).then(function([data, tileMap]) {
    // #region MAP SETUP
    var mapContainer = svg.append("g")
        .attr("id", "map-container")

    var map = mapContainer.append("g")
        .attr("id", "map")
        .selectAll("rect")
        .data(tileMap.states)
        .enter()
        .append("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", 5)
            .attr("height", 5)
            .attr("fill", "#bebebe");

    var mapAbb = mapContainer.append("g")
        .attr("id", "map-abb")
        .selectAll("text")
        .data(tileMap.states)
        .enter()
        .append("text")
            .text(d => d.abb)
            .attr("x", d => d.x + 2.4)
            .attr("y", d => d.y + 3.2)
            .attr("fill", "black")
            .attr("font-size", "2px")
            .attr("text-anchor", "middle")

    mapContainer.attr("transform", "translate(160, 40) scale(8)")

    // #endregion

    // #region BAR CHART SETUP
    var barData = d3.rollups(data,
        v => v.length,
        d => d.Ranking,
        d => d.Year
    );

    var barScaleY = d3.scaleLinear()
        .domain([0, 50])
        .range([0, 270]);

    // initial bar chart
    var barChart = svg.append("g")
        .attr("id", "barChart")

    var bar1 = barChart
        .append("rect")
            .attr("y", 285)
            .attr("x", 700)
            .attr("height", 25)
            .attr("width", 150)
            .attr("fill", "#bebebe")

    var bar2 = barChart
        .append("rect")
            .attr("y", 335)
            .attr("x", 700)
            .attr("height", 25)
            .attr("width", 150)
            .attr("fill", "#bebebe")

    var bar3 = barChart
        .append("rect")
            .attr("y", 385)
            .attr("x", 700)
            .attr("height", 25)
            .attr("width", 150)
            .attr("fill", "#bebebe")

    var barText1 = barChart
        .append("text")
            .attr("y", 302)
            .attr("x", 860)

    var barText2 = barChart
        .append("text")
            .attr("y", 352)
            .attr("x", 860)

    var barText3 = barChart
        .append("text")
            .attr("y", 402)
            .attr("x", 860)

    barChart.append("g")
        .attr("id", "barChart-x-axis")
        .append("rect")
            .attr("x", 700)
            .attr("y", 275)
            .attr("width", 1)
            .attr("height", 145)
            .attr("fill", "#555555ff")

    barChart
        .attr("transform", "translate (10, 85)")

    // #endregion

    // #region UPDATE MAP
    function updateMap(inputYear) {
        currYear = (inputYear - 2000) / 2; // update currYear based on inputYear

        // select data based on variable
        for (var i = 0; i < data.length; i++) { // loop through VBED data
            var dataState = data[i].State;
            var dataValue = data[i].Ranking;
            var dataYear = data[i].Year;

            for (var j = 0; j < tileMap.states.length; j++) { // loop through json until match
                var mapState = tileMap.states[j].name;

                if (dataState == mapState && dataYear == inputYear) {
                    tileMap.states[j].value = dataValue; // once match is found, update value based on year
                    break;
                }
            }
        }

        // update map
        svg.select("#map")
            .selectAll("rect")
            .transition()
            .duration(750)
            .attr("fill", function(d) {
                return colorScale(d.value)
            });

        // update circle selection
        d3.selectAll("circle")
            .transition()
            .duration(500)
            .style("fill", "#bebebe")

        d3.select("#circle-" + inputYear)
            .transition()
            .duration(500)
            .style("fill", "#243a76")

        // update bar chart
        bar1
            .transition()
            .duration(750)
            .attr("fill", "#3b9171")
            .attr("width", barScaleY(barData[1][1].sort()[currYear][1]));

        bar2
            .transition()
            .duration(750)
            .attr("fill", "#efc55b")
            .attr("width", barScaleY(barData[2][1].sort()[currYear][1]));

        bar3
            .transition()
            .duration(750)
            .attr("fill", "#ef7f4d")
            .attr("width", barScaleY(barData[0][1].sort()[currYear][1]));

        barText1
            .transition()
            .duration(750)
            .attr("x", 700 + barScaleY(barData[1][1].sort()[currYear][1]) + 10)
            .text(barData[1][1].sort()[currYear][1]);

        barText2
            .transition()
            .duration(750)
            .attr("x", 700 + barScaleY(barData[2][1].sort()[currYear][1]) + 10)
            .text(barData[2][1].sort()[currYear][1]);

        barText3
            .transition()
            .duration(750)
            .attr("x", 700 + barScaleY(barData[0][1].sort()[currYear][1]) + 10)
            .text(barData[0][1].sort()[currYear][1]);
    }

    // #endregion

    // initialize map
    updateMap(2000);

    // #region TIMER
    var timerFunc = function() {
        if (yearSelect == 2) { // presidential
            currYear = (currYear + 2) % 14;
            updateMap(2000 + currYear * 2);
        } else if (yearSelect == 1) { // midterm
            currYear = (currYear + 2) % 12;
            updateMap(2000 + currYear * 2);
        } else { // all
            currYear = (currYear + 1) % 13; 
            updateMap(2000 + currYear * 2);
        }
    }

    // timer needs to be initialized so when the year options are clicked,
    // it has something to reference and stop
    let timer = d3.interval(timerFunc, 2500);
    timer.stop()

    // boolean to keep track of whether the animation is playing
    let playing = false;

    // play button behavior when clicked
    playButton
        .on("click", function() {
            if (playing) { return; } // prevents the playButton from activating when already playing

            playing = true;

            timer = d3.interval(timerFunc, 2500);
            d3.select(this)
                .attr("fill", "#243a76");

            d3.select("#pause")
                .transition()
                .duration(500)
                .attr("fill", "#bebebe");
        })

    // pause button behavior when clicked
    pauseButton 
        .on("click", function() {
            timer.stop();

            playing = false;

            d3.select(this)
                .attr("fill", "#243a76");

            d3.select("#play")
                .transition()
                .duration(500)
                .attr("fill", "#bebebe");
        })

    // #endregion

    // #region YEAR TIMELINE BUTTON FUNCTIONS
    function initYearOptions(type) {
        d3.selectAll("." + type)
            .attr("opacity", 1)
            .on("click", function(e,d) {
                timer.stop()
                playing = false;
                updateMap(d.year)

                d3.select(this)
                    .style("fill", "#243a76")

                d3.select("#play")
                    .transition()
                    .duration(500)
                    .attr("fill", "#bebebe");

                d3.select("#pause")
                    .transition()
                    .duration(500)
                    .attr("fill", "#bebebe");
            })
            .on("mouseover", function(e, d) {
                d3.select(this)
                    .style("stroke", "#243a76")
                    .style("stroke-width", 1.2)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("stroke-width", 0);
            });
    }

    initYearOptions("presidential");
    initYearOptions("midterm");

    function disableYearOptions(type) {
        d3.selectAll("." + type)
            .attr("opacity", 0.1)
            .on("click", function() {
                return;
            })
            .on("mouseover", function() {
                return;
            })
            .on("mouseout",function() {
                return;
            });
    }

    // #region SELECTION BEHAVIOR

    // stops timer and updates map to smallest year in selected option
    // then deactivates the deselected years
    selections
        .on("click", function(e, d, i) {
            selections.attr("opacity", 0);
            selectionsText.attr("opacity", 0);
            selectionBarSelected = false;
            selectionBarText.text(d.option);

            yearSelect = d.index;

            if (yearSelect == 1) { // midterm
            yearRect // update year rectangle
                .attr("x", xScale(2002))
                .attr("width", xScale(2026) - xScale(2002))

            initYearOptions("midterm");
            disableYearOptions("presidential");
            updateMap(2002);

        } else if (yearSelect == 2) { // presidental
            yearRect
                .attr("x", xScale(2000))
                .attr("width", xScale(2024) - xScale(2000));

            initYearOptions("presidential");
            disableYearOptions("midterm");
            updateMap(2000);

        } else if (yearSelect == 0) { // all
            yearRect
                .attr("x", xScale(2000))
                .attr("width", xScale(2026) - xScale(2000));

            initYearOptions("presidential");
            initYearOptions("midterm");
            updateMap(2000);
        }
    })

    // #endregion

});

// event listeners
