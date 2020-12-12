var width = -margin.left - margin.right;
var height = -margin.top - margin.bottom;
var reportsData;
var tooltip;
var dict_data = {};
var scatter_data = [];
var color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(0, 9));
var color_map = {
  sewer_and_water: color(0),
  power: color(1),
  roads_and_bridges: color(2),
  medical: color(3),
  buildings: color(4),
  shake_intensity: color(5),
};

document.addEventListener("DOMContentLoaded", function () {
  //s_map = d3.select("#scatterplot")
  s_map = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  div = d3
    .select("body")
    .append("div")
    .attr("class", "label-map")
    .style("opacity", 0);
  cat_text = {
    shake_intensity: "\uf83e",
    sewer_and_water: "\uf043",
    power: "\uf0e7",
    roads_and_bridges: "\uf018",
    buildings: "\uf1ad",
    medical: "\uf469",
  };

  //Add checkboxes
  fcb = d3.select("#forcheckboxes").append("div").attr("class", "incheckboxes");
  arr_check = [
    "sewer_and_water",
    "power",
    "roads_and_bridges",
    "medical",
    "shake_intensity",
    "buildings",
  ];
  for (var i in arr_check) {
    fcb1 = fcb.append("label").attr("class", "m-2");
    fcb1
      .append("input")
      .attr("type", "checkbox")
      .attr("id", arr_check[i])
      .attr("name", "")
      .attr("value", arr_check[i])
      .attr("checked", true)
      .on("click", onChangeCheck);
    fcb1
      .append("div")
      .attr("class", "icon-box")
      .style("background", color_map[arr_check[i]])
      .append("span")
      .text(cat_text[arr_check[i]])
      .style("font-family", "FontAwesome");

    //.on("click", onChangeCheck)
  }
  fcb.style("display", "none");

  // 	Promise.all([d3.csv('data/updated_reports.csv')]).then(function(values){
  //         reportsData = values[0];

  // })
});

function drawScatter(arr_len, req_loc) {
  fcb.style("display", "flex");
  // console.log(reportsData);
  req_date = new Date(reportsData[arr_len - 1]["time"].replaceAll("-", "/"));
  s_map.selectAll("*").remove();
  for (i = 0; i < arr_len; i++) {
    var datetime = reportsData[i]["time"].replaceAll("-", "/");
    let date = new Date(datetime);
    if (
      date.getDate() == req_date.getDate() &&
      reportsData[i]["location"] == req_loc
    ) {
      //console.log(dict_data[date.getHours()])
      if (dict_data[date.getHours()] === undefined) {
        dict_data[date.getHours()] = {};
      }
      if (
        reportsData[i]["sewer_and_water"] === undefined ||
        reportsData[i]["sewer_and_water"] === null ||
        reportsData[i]["sewer_and_water"] === ""
      ) {
      } else {
        if (dict_data[date.getHours()]["sewer_and_water"] === undefined) {
          dict_data[date.getHours()]["sewer_and_water"] = +reportsData[i][
            "sewer_and_water"
          ];
          dict_data[date.getHours()]["sewer_and_water_count"] = 1;
        } else {
          dict_data[date.getHours()]["sewer_and_water"] += +reportsData[i][
            "sewer_and_water"
          ];
          dict_data[date.getHours()]["sewer_and_water_count"] += 1;
        }
      }
      if (
        reportsData[i]["power"] === undefined ||
        reportsData[i]["power"] === null ||
        reportsData[i]["power"] === ""
      ) {
      } else {
        if (dict_data[date.getHours()]["power"] === undefined) {
          dict_data[date.getHours()]["power"] = +reportsData[i]["power"];
          dict_data[date.getHours()]["power_count"] = 1;
        } else {
          dict_data[date.getHours()]["power"] += +reportsData[i]["power"];
          dict_data[date.getHours()]["power_count"] += 1;
        }
      }
      if (
        reportsData[i]["roads_and_bridges"] === undefined ||
        reportsData[i]["roads_and_bridges"] === null ||
        reportsData[i]["roads_and_bridges"] === ""
      ) {
      } else {
        if (dict_data[date.getHours()]["roads_and_bridges"] === undefined) {
          dict_data[date.getHours()]["roads_and_bridges"] = +reportsData[i][
            "roads_and_bridges"
          ];
          dict_data[date.getHours()]["roads_and_bridges_count"] = 1;
        } else {
          dict_data[date.getHours()]["roads_and_bridges"] += +reportsData[i][
            "roads_and_bridges"
          ];
          dict_data[date.getHours()]["roads_and_bridges_count"] += 1;
        }
      }
      if (
        reportsData[i]["medical"] === undefined ||
        reportsData[i]["medical"] === null ||
        reportsData[i]["medical"] === ""
      ) {
      } else {
        if (dict_data[date.getHours()]["medical"] === undefined) {
          dict_data[date.getHours()]["medical"] = +reportsData[i]["medical"];
          dict_data[date.getHours()]["medical_count"] = 1;
        } else {
          dict_data[date.getHours()]["medical"] += +reportsData[i]["medical"];
          dict_data[date.getHours()]["medical_count"] += 1;
        }
      }
      if (
        reportsData[i]["buildings"] === undefined ||
        reportsData[i]["buildings"] === null ||
        reportsData[i]["buildings"] === ""
      ) {
      } else {
        if (dict_data[date.getHours()]["buildings"] === undefined) {
          dict_data[date.getHours()]["buildings"] = +reportsData[i][
            "buildings"
          ];
          dict_data[date.getHours()]["buildings_count"] = 1;
        } else {
          dict_data[date.getHours()]["buildings"] += +reportsData[i][
            "buildings"
          ];
          dict_data[date.getHours()]["buildings_count"] += 1;
        }
      }
      if (
        reportsData[i]["shake_intensity"] === undefined ||
        reportsData[i]["shake_intensity"] === null ||
        reportsData[i]["shake_intensity"] === ""
      ) {
      } else {
        if (dict_data[date.getHours()]["shake_intensity"] === undefined) {
          dict_data[date.getHours()]["shake_intensity"] = +reportsData[i][
            "shake_intensity"
          ];
          dict_data[date.getHours()]["shake_intensity_count"] = 1;
        } else {
          dict_data[date.getHours()]["shake_intensity"] += +reportsData[i][
            "shake_intensity"
          ];
          dict_data[date.getHours()]["shake_intensity_count"] += 1;
        }
      }
    }
  }
  //console.log(Object.keys(dict_data))
  var scatter_data = [];
  for (var i in Object.keys(dict_data)) {
    key = Object.keys(dict_data)[i];
    //console.log(dict_data[key])
    if (dict_data[key]["sewer_and_water"] != undefined)
      scatter_data.push([
        key,
        dict_data[key]["sewer_and_water"] /
          dict_data[key]["sewer_and_water_count"],
        "sewer_and_water",
      ]);
    if (dict_data[key]["power"] != undefined)
      scatter_data.push([
        key,
        dict_data[key]["power"] / dict_data[key]["power_count"],
        "power",
      ]);
    if (dict_data[key]["roads_and_bridges"] != undefined)
      scatter_data.push([
        key,
        dict_data[key]["roads_and_bridges"] /
          dict_data[key]["roads_and_bridges_count"],
        "roads_and_bridges",
      ]);
    if (dict_data[key]["medical"] != undefined)
      scatter_data.push([
        key,
        dict_data[key]["medical"] / dict_data[key]["medical_count"],
        "medical",
      ]);
    if (dict_data[key]["buildings"] != undefined)
      scatter_data.push([
        key,
        dict_data[key]["buildings"] / dict_data[key]["buildings_count"],
        "buildings",
      ]);
    if (dict_data[key]["shake_intensity"] != undefined)
      scatter_data.push([
        key,
        dict_data[key]["shake_intensity"] /
          dict_data[key]["shake_intensity_count"],
        "shake_intensity",
      ]);
  }
  //console.log(scatter_data)
  draw_scatter(scatter_data);
}

function displayData(display_data) {
  //console.log(d3.event.pageX + 10,d3.event.pageY + 15,display_data)
  div
    .html(display_data)
    .style("left", d3.event.pageX + 10 + "px")
    .style("top", d3.event.pageY + 15 + "px");
}
function onChangeCheck() {
  scatter_data2 = [];

  var sewer_and_water_check = document.getElementById("sewer_and_water")
    .checked;
  var power_check = document.getElementById("power").checked;
  var roads_and_bridges_check = document.getElementById("roads_and_bridges")
    .checked;
  var medical_check = document.getElementById("medical").checked;
  var buildings_check = document.getElementById("buildings").checked;
  var shake_intensity_check = document.getElementById("shake_intensity")
    .checked;

  //   console.log(typeof sewer_and_water_check);

  if (
    !sewer_and_water_check &&
    !power_check &&
    !roads_and_bridges_check &&
    !medical_check &&
    !buildings_check &&
    !shake_intensity_check
  ) {
    // console.log("nothing selected");
    s_map.selectAll("*").remove();
    draw_scatter();
  } else {
    s_map.selectAll("*").remove();

    if (sewer_and_water_check) {
      for (var i in Object.keys(dict_data)) {
        key = Object.keys(dict_data)[i];
        if (dict_data[key]["sewer_and_water"] != undefined)
          scatter_data2.push([
            key,
            dict_data[key]["sewer_and_water"] /
              dict_data[key]["sewer_and_water_count"],
            "sewer_and_water",
          ]);
      }
    }

    if (power_check) {
      for (var i in Object.keys(dict_data)) {
        key = Object.keys(dict_data)[i];
        if (dict_data[key]["power"] != undefined)
          scatter_data2.push([
            key,
            dict_data[key]["power"] / dict_data[key]["power_count"],
            "power",
          ]);
      }
    }

    if (roads_and_bridges_check) {
      for (var i in Object.keys(dict_data)) {
        key = Object.keys(dict_data)[i];
        if (dict_data[key]["roads_and_bridges"] != undefined)
          scatter_data2.push([
            key,
            dict_data[key]["roads_and_bridges"] /
              dict_data[key]["roads_and_bridges_count"],
            "roads_and_bridges",
          ]);
      }
    }

    if (medical_check) {
      for (var i in Object.keys(dict_data)) {
        key = Object.keys(dict_data)[i];
        if (dict_data[key]["medical"] != undefined)
          scatter_data2.push([
            key,
            dict_data[key]["medical"] / dict_data[key]["medical_count"],
            "medical",
          ]);
      }
    }

    if (buildings_check) {
      for (var i in Object.keys(dict_data)) {
        key = Object.keys(dict_data)[i];
        if (dict_data[key]["buildings"] != undefined)
          scatter_data2.push([
            key,
            dict_data[key]["buildings"] / dict_data[key]["buildings_count"],
            "buildings",
          ]);
      }
    }

    if (shake_intensity_check) {
      for (var i in Object.keys(dict_data)) {
        key = Object.keys(dict_data)[i];
        if (dict_data[key]["shake_intensity"] != undefined)
          scatter_data2.push([
            key,
            dict_data[key]["shake_intensity"] /
              dict_data[key]["shake_intensity_count"],
            "shake_intensity",
          ]);
      }
    }

    draw_scatter(scatter_data2);
  }
}
function draw_scatter(scatter_data) {
  xScale = d3.scaleLinear().range([0, width]).domain([0, 23]);
  yScale = d3.scaleLinear().range([height, 0]).domain([0, 10]);

  //console.log(xScale,yScale);

  //s_map.selectAll(".axis").remove();

  //console.log(xScale,yScale);

  //s_map.selectAll(".axis").remove();

  circles = s_map.selectAll(".location");

  circles
    .data(scatter_data, (d) => String(d[0]) + String(d[1]) + d[2])
    .join((enter) => {
      const g = enter
        .append("g")
        .attr("class", "location")
        .attr(
          "transform",
          (d, i) => `translate(${xScale(d[0])},${yScale(d[1])})`
        );

      g.append("circle")
        .attr("r", "10")
        .attr("fill", function (d) {
          return color_map[d[2]];
        })
        .style("opacity", 0.5);
      g.append("text")
        .text(function (d) {
          return cat_text[d[2]];
        })
        .style("cursor", "default")
        .style("font-family", "FontAwesome")
        .style("font-size", "14px")
        .attr("y", 6)
        .style("alignment-baseline", "middle")
        .style("text-anchor", "middle");
    });
  cat_text_scatter = {
    shake_intensity: "Shake intensity",
    sewer_and_water: "Sewer and Water",
    power: "Power",
    roads_and_bridges: "Roads and Bridges",
    buildings: "Buildings",
    medical: "Medical",
  };
  s_map
    .selectAll(".location")
    .on("mousemove", function (d) {
      //console.log(d);
      // if(d[2]=="")
      var display =
        "Hour of the day : <b style='color: black;'>" +
        d[0] +
        "</b><br/>" +
        cat_text_scatter[d[2]] +
        " Average: <b style='color: black;'>" +
        d[1].toFixed(2) +
        "</b>";
      // console.log(display,cat_text_scatter[d[2]]);
      d3.select(this).transition().duration("50").attr("opacity", ".85");

      div.transition().duration(500).style("opacity", 1);

      displayData(display);
      //return tooltip.style("visibility", "visible").text("Hello");
    })

    //.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    //.on("mouseout", function(){return tooltip.style("visibility", "visible");});
    .on("mouseout", function (d) {
      d3.select(this).transition().duration("50").attr("opacity", "1");
      div.transition().duration(50).style("opacity", 0);
    });

  const yAxis = d3.axisLeft(yScale);
  s_map
    .append("g")
    .attr("class", "scatterYAxis")
    .attr("transform", `translate(0,0)`)
    .call(yAxis);
  const xAxis = d3.axisBottom(xScale);
  s_map
    .append("g")
    .attr("class", "scatterXAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  s_map
    .append("text")
    .attr("class", "axis")
    .attr("x", width - 400)
    .attr("y", height + 40)
    .style("fill", "black")
    .attr("font-family", "var(--font)")
    .text("Hour of the day");

  s_map
    .append("text")
    .attr("class", "axis")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("font-family", "var(--font)")
    .attr("x", -height + 200)
    .attr("y", -30)
    .style("fill", "black")
    .text("Average Impact");
}
