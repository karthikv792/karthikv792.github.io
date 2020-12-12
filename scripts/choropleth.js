const margin = { top: 20, right: 20, bottom: 50, left: 50 };
var width = -margin.left - margin.right;
var height = -margin.top - margin.bottom;
var currentValue = 0;
click_flag = {};
document.addEventListener("DOMContentLoaded", function () {
  // rectt = document.getElementById('plot-container').getBoundingClientRect();
  width += 720;
  height += 480;
  extent = [0, 200];
  c_map = d3
    .select("#choropleth")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom + 300);
  // nav = d3.select("#navigation").attr("width",200)
  // .attr("height",300)

  d3.select("#navi")
    .append("div")
    .attr("class", "year label mr-1")
    .attr("id", "nav")
    .attr("text-anchor", "end")
    .attr("y", height - 30)
    .attr("x", width);
  d3.select("#navi")
    .append("text")
    .attr("class", "mr-1")
    .attr("id", "locations")
    .style("fill", "#2A2E45")
    .style("font-size", "30px")
    .style("font-family", "FontAwesome")
    .text("\uf21d")
    .style("opacity", 0);
  d3.select("#navi")
    .append("div")
    .attr("class", "year label mr-1")
    .attr("id", "nav12")
    .attr("text-anchor", "end")
    .attr("y", height - 30)
    .attr("x", width);

  d3.selectAll(".clickable").style("display", "none");

  var elementPosition = $("#navi").offset();
  d3.selectAll(".clickable").style("display", "none");
  $(window).scroll(function () {
    if ($(window).scrollTop() > elementPosition.top) {
      $("#navi").css("position", "fixed").css("top", "0px");
    } else {
      $("#navi").css("position", "static").css("top", "0px");
    }
  });

  Promise.all([
    d3.json("data/StHimark.geojson"),
    d3.csv("data/updated_reports.csv"),
    d3.csv("data/barchart_cumulativedata.csv"),
  ]).then(function (values) {
    mapData = values[0];
    barData = values[2];
    reportsData = values[1];
    preprocess();
    // console.log(barData)

    drawMap();
    // draw_innovative();
    // d3.select(".pageloader").style("display","none");
    d3.select("#navi").style("display", "flex");
    d3.select(".chorotitle").style("display", "inline-block");

    d3.select("#play-button").style("display", "inline-block");
  });
});
var map;
main_dict = [];
// barData = [];
function preprocess() {
  score_dict = {};
  score_dict2 = {};
  new_date = new Date(reportsData[0]["time"].replaceAll("-", "/"));
  for (var j in reportsData.slice(0, -1)) {
    n_date = new Date(reportsData[j]["time"].replaceAll("-", "/"));
    loct = +reportsData[j]["location"];
    saw = +reportsData[j]["sewer_and_water"];
    power = +reportsData[j]["power"];
    roads = +reportsData[j]["roads_and_bridges"];
    med = +reportsData[j]["medical"];
    buildings = +reportsData[j]["buildings"];
    si = +reportsData[j]["shake_intensity"];
    arr2 = [saw, power, roads, med, buildings, si, 1];
    // new_arr2 = [arr2.slice(0,5).reduce((a,b)=>a+b)/5,arr2.slice(0,6).reduce((a,b)=>a+b)/6,1]
    // if (n_date.getDate() != new_date.getDate()) {
    //   score_dict2 = {};
    //   new_date.setDate(n_date.getDate());
    // }
    if (Object.keys(score_dict).includes(loct)) {
      score_dict[loct] = score_dict[loct].map(function (num, idx) {
        return num + arr2[idx];
      });
    } else {
      score_dict[loct] = arr2;
    }
    // if(Object.keys(score_dict2).includes(loct)){

    //   score_dict2[loct] = score_dict2[loct].map(function (num, idx) {
    //     return num + new_arr2[idx];
    //   });

    // }
    // else{
    //   score_dict2[loct] = new_arr2
    // }

    temp_dict = JSON.parse(JSON.stringify(score_dict));
    main_dict.push({ time: n_date, score: temp_dict });
    // temp_dict2 = JSON.parse(JSON.stringify(score_dict2))
    // barData.push({"time":reportsData[j]["time"].replaceAll('-','/'),"ImpactAndDamagePerDay":Object.entries(temp_dict2)})
  }
}
function drawMap() {
  c_map.selectAll("*").remove();
  var playButton = d3.select("#play-button");
  playButton.on("click", function () {
    var button = d3.select(this);
    // console.log(button.html())
    if (button.html() == "Pause") {
      button.html("Play");
      clearInterval(stepTimer);
    } else {
      button.html("Pause");
      stepTimer = setInterval(step, 100);
    }
  });
  function step() {
    invert1 = sliderScale.invert(currentValue);
    update(invert1);
    invert1.setMinutes(invert1.getMinutes() + 5);
    currentValue = sliderScale(invert1);

    if (currentValue > extent[1]) {
      clearInterval(stepTimer);
      d3.select("#play").attr("value", "Play");
      currentValue = 0;
    }
  }
  // create the map projection and geoPath
  slider();
}

function slider() {
  var formatDateIntoYear = d3.timeFormat("%Y");
  formatDay = d3.timeFormat("%a %d");
  var formatDate = d3.timeFormat("%b %Y");
  var slider = c_map
    .append("g")
    .attr("class", "slider")
    .attr("transform", "translate(0," + height / 2 + ")");
  // formatSecond = d3.timeFormat(":%S")
  checkdate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
  // console.log(timeData[10]["time"]==checkdate(date))

  // console.log(Object.values(timeData).length)//d3.extent(timeData,function(d){date = new Date(d.time); return date}))

  sliderScale = d3
    .scaleTime()
    .domain(
      d3.extent(main_dict, function (d) {
        return d.time;
      })
    )
    .range(extent);
  slider
    .append("line")
    .attr("class", "track")
    .attr("transform", "translate(0," + 35 + ")")
    .attr("x1", sliderScale.range()[0])
    .attr("x2", sliderScale.range()[1])
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-inset")
    .select(function () {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr("class", "track-overlay")
    .call(
      d3
        .drag()
        .on("start.interrupt", function () {
          slider.interrupt();
        })
        .on("start drag", function () {
          currentValue = d3.event.x;
          if (currentValue > extent[1]) {
            currentValue = extent[1];
          } else if (currentValue < extent[0]) {
            currentValue = extent[0];
          }
          update(sliderScale.invert(currentValue));
        })
    );

  slider
    .insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 35 + ")")
    .selectAll("text")
    .data(sliderScale.ticks(5))
    .enter()
    .append("text")
    .attr("font-family", "var(--font)")
    .attr("x", sliderScale)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function (d) {
      return formatDay(d);
    });

  // label = slider.append("text")
  // .attr("class", "label")
  // .attr("text-anchor", "middle")
  // .text(formatDate(startDate))
  // .attr("transform", "translate(0," + (-25) + ")")

  handle = slider
    .insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("transform", "translate(0," + 35 + ")")
    .attr("r", 4);

  update(sliderScale.invert(currentValue));
}
function update(x) {
  // console.log(x);
  //Gets the nearest 5th minute time
  // Add over lay

  d3.selectAll(".clock").style("opacity", 1);
  d3.select("#locations").style("opacity", 0);
  d3.selectAll(".clickable").style("display", "none");
  d3.select("#nav12").text("");
  //////////
  handle.attr("cx", currentValue);

  var coeff = 1000 * 60 * 5;
  var rounded = new Date(Math.round(x.getTime() / coeff) * coeff);
  // console.log("Rounded",rounded)
  //Gets the next 5th minute time
  rounded.setMinutes(rounded.getMinutes() + 5);
  // console.log("Nearest",rounded)
  // "%Y-%m-%d %H:%M:%S"
  checkdate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
  checkd = d3.timeFormat("%a %b %d %H:%M:%S");

  d3.select("#nav").text(checkd(x));
  bisect = d3.bisector((d) => d.time).left;
  // console.log(main_dict);
  // console.log(checkdate(rounded),bisect(timeData,checkdate(rounded)))
  const bisected = bisect(main_dict, rounded, -1);
  // console.log(bisected)

  var x_axis_value = x.getDate();
  //console.log(checkdate1(x))
  color_map1(bisected, x_axis_value, x);
  // color_bar(bisected)
  //drawBar()
}
// function data(i){
//   temp_data = timeData.slice(0,10);
//   temp_list = (eval(temp_data[3].ImpactAndDamage))

// }
function color_map1(bisected, x_axis_value, x_initial) {
  // data = timeData.slice(0,bisected)
  // console.log(timeData[bisected])
  imptData = main_dict[bisected - 1];
  // console.log(imptData)
  var colorScale = d3
    .scaleSequential(d3.interpolateReds) //eval("d3."+document.getElementById("color-scale-select").value))
    .domain([0, 10]);
  xScale = d3.scaleLinear().domain(colorScale.domain()).range([0, width]);

  let projection = d3
    .geoMercator()
    .scale(50000)
    .center(d3.geoCentroid(mapData))
    .translate([157150, 320]);
  // console.log(d3.geoCentroid(mapData))
  let path = d3.geoPath().projection(projection);
  map = c_map.append("g");
  on_date = d3.timeFormat("%a %b %d");
  map
    .selectAll("path")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("id", (d) => {
      click_flag[+d.properties.Id] = 0;
      return d.properties.Id;
    })
    .attr("class", "countrymap")
    // g.style("position","relative");
    // console.log(+c_map.style('width'))
    .style("fill", (d) => {
      // console.log(imptData["score"][+d.properties.Id].slice(0,6).reduce((a,b)=>a+b)/imptData["score"][+d.properties.Id][6])
      if (imptData["score"][+d.properties.Id] != undefined) {
        return colorScale(
          imptData["score"][+d.properties.Id]
            .slice(0, 6)
            .reduce((a, b) => a + b) /
            (6 * imptData["score"][+d.properties.Id][6])
        );
      }
      // temp_list = (eval(timeData[bisected-1].ImpactAndDamage))
      // for (var i in temp_list){
      //   if(+temp_list[i][0]==d.properties.Id){
      //     return colorScale(+temp_list[i][1][1]/+temp_list[i][1][2])
      //   }
      // } ;
    })
    .on("click", function (d, i) {
      d3.selectAll(".clickable").style("display", "flex");
      d3.select("#nav12").text("- " + d.properties.Nbrhood);
      d3.select("#locations").style("opacity", 1);
      document.getElementById("time-select").value = "All";
      d3.select(".reliable").text(
        "Report reliability for " +
          d.properties.Nbrhood +
          " on " +
          on_date(x_initial)
      );
      d3.select(".hourlyreports").text(
        "Hourly reports for " +
          d.properties.Nbrhood +
          " on " +
          on_date(x_initial)
      );
      d3.select(".innovativetitle").text(
        "Report comparison between neighbourhoods" + " on " + on_date(x_initial)
      );
      drawScatter(bisected, +d.properties.Id);
      drawInnovative(bisected);
      drawRadarChart(bisected, x_axis_value, +d.properties.Id);
    })
    .on("mouseover", function (d) {
      barchart(bisected, x_axis_value, x_initial, +d.properties.Id);
      d3.select(".bartooltip")
        .style("display", "inline-block")
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + 30 + "px")
        .select(".nbrhood text")
        .text(d.properties.Nbrhood)
        .style("text-anchor", "middle")
        // .style("font-weight","700")
        .style("fill", "black")
        .style("font-size", "14px");
      cmltext = d3
        .select(".bartooltip .row .cml .cml2 text")
        .style("text-anchor", "middle")
        // .style("font-weight","700")
        .style("fill", "black")
        .style("font-size", "14px");
      if (imptData["score"][+d.properties.Id] != undefined) {
        cmltext.text(
          parseFloat(
            imptData["score"][+d.properties.Id]
              .slice(0, 6)
              .reduce((a, b) => a + b) /
              (6 * imptData["score"][+d.properties.Id][6])
          ).toFixed(2)
        );
      } else {
        cmltext.text(0);
      }
    })
    .on("mouseout", function (d) {
      d3.select(".bartooltip").style("display", "none");
      d3.select(this).classed("hover_highlight", false);
    })
    .on("mousemove", function (d) {
      d3.select(this).classed("hover_highlight", true);
    });
}
