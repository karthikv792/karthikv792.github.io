// JavaScript file to draw the Radar Chart, specific
// to the day and location that is selected on the Choropleth map

var width = -margin.left - margin.right;
var height = -margin.top - margin.bottom;
var shake_intensity_radius = 0;
var reportsData;
var color_radar = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(0, 9));
var color_map_radar = {
  sewer_and_water: color(0),
  power: color(1),
  roads_and_bridges: color(2),
  medical: color(3),
  buildings: color(4),
  shake_intensity: color(5),
};
var cat_text_radar = {
  shake_intensity: "\uf83e",
  sewer_and_water: "\uf043",
  power: "\uf0e7",
  roads_and_bridges: "\uf018",
  buildings: "\uf1ad",
  medical: "\uf469",
};
document.addEventListener("DOMContentLoaded", function () {
  //	width += 900;
  //    height += 348;

  radarSvg = d3
    .select("#radar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Promise.all([d3.csv('data/updated_reports.csv')]).then(function(values){
  //     reportsData = values[0];
  //    // console.log(reportsData)
  //     // drawRadarChart();
  // })
  d3.select("#legendIcons").append("div");
  // legends();
});

function legends() {
  var elementPosition = $("#legendIcons").offset();

  $(window).scroll(function () {
    if ($(window).scrollTop() > elementPosition.top) {
      $("#legendIcons").css("position", "fixed").css("top", "0px");
    } else {
      $("#legendIcons").css("position", "static").css("top", "0px");
    }
  });
}

var arr_len_init;
var req_date_init;
var req_loc_init;
function on_change_Radar() {
  drawRadarChart(arr_len_init, req_date_init, req_loc_init);
}

var json = [
  [
    { area: "sewer_and_water ", value: 8 },
    { area: "power", value: 4 },
    { area: "roads_and_bridges ", value: 4 },
    { area: "medical ", value: 9 },
    { area: "buildings ", value: 0 },
  ],
];

var testing = [];

function drawRadarChart(arr_len, req_date, req_loc) {
  d3.select(".radartime").style("display", "flex");
  var drop_down = document.getElementById("time-select").value;
  //console.log(json[0][0])
  arr_len_init = arr_len;
  req_date_init = req_date;
  req_loc_init = req_loc;
  radarSvg.selectAll("*").remove();

  // Configurations for the Radar chart (which we want to customize)
  time_start = 0;
  time_end = 24;

  if (drop_down == "00") {
    time_end = 3;
  }
  if (drop_down == "03") {
    time_start = 3;
    time_end = 6;
  }
  if (drop_down == "06") {
    time_start = 6;
    time_end = 9;
  }
  if (drop_down == "09") {
    time_start = 9;
    time_end = 12;
  }
  if (drop_down == "12") {
    time_start = 12;
    time_end = 15;
  }
  if (drop_down == "15") {
    time_start = 15;
    time_end = 18;
  }
  if (drop_down == "18") {
    time_start = 18;
    time_end = 21;
  }
  if (drop_down == "21") {
    time_start = 21;
  }
  var config = {
    w: 300,
    h: 300,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 300,
  };
  values = [0, 0, 0, 0, 0, 0];
  count = 0;
  for (i = 0; i < arr_len; i++) {
    var datetime = reportsData[i]["time"].replaceAll("-", "/");
    let date = new Date(datetime);

    if (
      date.getDate() == req_date &&
      date.getHours() >= time_start &&
      date.getHours() <= time_end &&
      reportsData[i]["location"] == req_loc
    ) {
      //console.log(reportsData[i])
      values[0] += +reportsData[i]["sewer_and_water"];
      values[1] += +reportsData[i]["power"];
      values[2] += +reportsData[i]["roads_and_bridges"];
      values[3] += +reportsData[i]["medical"];
      values[4] += +reportsData[i]["buildings"];
      values[5] += +reportsData[i]["shake_intensity"];
      // console.log(+reportsData[i]['shake_intensity'])
      count += 1;
    }
  }
  for (i = 0; i < values.length - 1; i++) {
    if (values[i] === "Undefined") continue;
    if (count != 0) json[0][i]["value"] = values[i] / count;
    else json[0][i]["value"] = 0;
  }
  if (count != 0) shake_intensity_radius = values[5] / count;
  else shake_intensity_radius = 0;
  // console.log(values)
  //code to draw the Radar Chart
  RadarChart.draw("#radar", json, config);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var RadarChart = {
  draw: function (id, d, options) {
    //These are the default configurations (if not specified in the 'options' arguement)
    var cfg = {
      radius: 5,
      w: 800,
      h: 900,
      factor: 1,
      factorLegend: 0.85,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 60,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"]),
    };

    // Override the values of options in the configuration
    if ("undefined" !== typeof options) {
      for (var i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i];
        }
      }
    }

    cfg.maxValue = 100;

    // axis labels
    var allAxis = d[0].map(function (i, j) {
      return i.area;
    });
    var total = allAxis.length;

    //Re-calculating the radius based on cfg values
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
    var Format = d3.format("%");
    d3.select(id).selectAll("svg").remove();

    var circle = d3
      .select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr(
        "transform",
        "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")"
      )
      .append("circle")
      .attr("fill", "orange")
      .attr("opacity", 0.3)
      .attr("cx", cfg.w / 2)
      .attr("cy", cfg.h / 2)
      .attr("r", cfg.factor * radius * (shake_intensity_radius / 10));

    // Setting the width and height of the graph
    var g = d3
      .select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr(
        "transform",
        "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")"
      );

    var tooltip;

    //Polygon-shaped segments to show the boundaries of different levels
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", function (d, i) {
          return (
            levelFactor * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
          );
        })
        .attr("y1", function (d, i) {
          return (
            levelFactor * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
          );
        })
        .attr("x2", function (d, i) {
          return (
            levelFactor *
            (1 - cfg.factor * Math.sin(((i + 1) * cfg.radians) / total))
          );
        })
        .attr("y2", function (d, i) {
          return (
            levelFactor *
            (1 - cfg.factor * Math.cos(((i + 1) * cfg.radians) / total))
          );
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr(
          "transform",
          "translate(" +
            (cfg.w / 2 - levelFactor) +
            ", " +
            (cfg.h / 2 - levelFactor) +
            ")"
        );
    }

    //Text indicating at what % each level is (example - 20, 40, 60, etc.)
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function (d) {
          return levelFactor * (1 - cfg.factor * Math.sin(0));
        })
        .attr("y", function (d) {
          return levelFactor * (1 - cfg.factor * Math.cos(0));
        })
        .attr("class", "legend")
        .style("font-family", "var(--font)")
        .style("font-size", "10px")
        .attr(
          "transform",
          "translate(" +
            (cfg.w / 2 - levelFactor + cfg.ToRight) +
            ", " +
            (cfg.h / 2 - levelFactor) +
            ")"
        )
        .attr("fill", "#737373")
        .text(((j + 1) * 10) / cfg.levels);
    }

    series = 0;

    var axis = g
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    //drawing the line axes
    axis
      .append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function (d, i) {
        return (
          (cfg.w / 2) * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
        );
      })
      .attr("y2", function (d, i) {
        return (
          (cfg.h / 2) * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
        );
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    // Labels for the axes
    axis
      .append("text")
      .attr("class", "legend")
      .text(function (d) {
        // console.log(d,cat_text_radar[d])
        return cat_text_radar[d.trim()];
      })
      .style("font-family", "FontAwesome")
      .style("fill", function (d) {
        return color_map_radar[d.trim()];
      })
      .style("font-size", "26px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .style("stroke", "black")
      .attr("transform", function (d, i) {
        return "translate(0, -10)";
      })
      .attr("x", function (d, i) {
        return (
          (cfg.w / 2) *
            (1 - cfg.factorLegend * Math.sin((i * cfg.radians) / total)) -
          60 * Math.sin((i * cfg.radians) / total)
        );
      })
      .attr("y", function (d, i) {
        if (d.trim() != "sewer_and_water") {
          return (
            (cfg.h / 2) * (1 - Math.cos((i * cfg.radians) / total)) -
            20 * Math.cos((i * cfg.radians) / total)
          );
        } else {
          return (
            (cfg.h / 2) * (1 - Math.cos((i * cfg.radians) / total)) -
            20 * Math.cos((i * cfg.radians) / total) -
            20
          );
        }
      });

    //calculating the data-points (corners) of the polygon
    //console.log(d)
    d.forEach(function (y, x) {
      dataValues = [];
      g.selectAll(".nodes").data(y, function (j, i) {
        //console.log(i)
        dataValues.push([
          (cfg.w / 2) *
            (1 -
              (parseFloat(Math.max(j.value * 10, 0)) / cfg.maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / total)),
          (cfg.h / 2) *
            (1 -
              (parseFloat(Math.max(j.value * 10, 0)) / cfg.maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / total)),
        ]);
      });

      dataValues.push(dataValues[0]);

      // to draw the area of the polygon
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-serie" + series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .attr("points", function (d) {
          var str = "";
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " ";
          }
          return str;
        })
        .style("fill", function (j, i) {
          return cfg.color(series);
        })
        .style("fill-opacity", cfg.opacityArea)
        .on("mouseover", function (d) {
          z = "polygon." + d3.select(this).attr("class");
          g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
          g.selectAll(z).transition(200).style("fill-opacity", 0.7);
        })
        .on("mouseout", function () {
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);
        });
      series++;
    });

    series = 0;
    var shake_text = d3
      .select(id)
      .append("svg")
      .append("g")
      .attr(
        "transform",
        "translate(" +
          cfg.w / 2 +
          "," +
          (cfg.h + cfg.factor * radius * 0.75) +
          ")"
      )
      .append("text")
      .attr("font-family", "var(--font)")
      .style("font-size", "14px")
      .style("fill", "grey")
      .text(
        "Shake Intensity is: " + parseFloat(shake_intensity_radius).toFixed(2)
      );
    //tooltip for each data point
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    cat_text_radar_names = {
      shake_intensity: "Shake intensity",
      sewer_and_water: "Sewer and Water",
      power: "Power",
      roads_and_bridges: "Roads and Bridges",
      buildings: "Buildings",
      medical: "Medical",
    };
    d.forEach(function (y, x) {
      g.selectAll(".nodes")
        .data(y)
        .enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + series)
        .attr("r", cfg.radius)
        .attr("alt", function (j) {
          return Math.max(j.value, 0);
        })
        .attr("cx", function (j, i) {
          dataValues.push([
            (cfg.w / 2) *
              (1 -
                (parseFloat(Math.max(j.value * 10, 0)) / cfg.maxValue) *
                  cfg.factor *
                  Math.sin((i * cfg.radians) / total)),
            (cfg.h / 2) *
              (1 -
                (parseFloat(Math.max(j.value * 10, 0)) / cfg.maxValue) *
                  cfg.factor *
                  Math.cos((i * cfg.radians) / total)),
          ]);
          return (
            (cfg.w / 2) *
            (1 -
              (Math.max(j.value * 10, 0) / cfg.maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / total))
          );
        })
        .attr("cy", function (j, i) {
          return (
            (cfg.h / 2) *
            (1 -
              (Math.max(j.value * 10, 0) / cfg.maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / total))
          );
        })
        .attr("data-id", function (j) {
          return j.area;
        })
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .style("fill-opacity", 0.9)
        .on("mouseover", function (d) {
          //console.log(d.area)
          tooltip
            .style("left", d3.event.pageX - 40 + "px")
            .style("top", d3.event.pageY - 80 + "px")
            .style("display", "inline-block")
            .html(
              cat_text_radar_names[d.area.trim()] +
                "<br><span>" +
                parseFloat(d.value).toFixed(2) +
                "</span>"
            );
        })
        .on("mouseout", function (d) {
          tooltip.style("display", "none");
        });

      series++;
    });

    circle
      .on("mouseover", function (d) {
        tooltip
          .style("left", d3.event.pageX - 40 + "px")
          .style("top", d3.event.pageY - 80 + "px")
          .style("display", "inline-block")
          .html(
            "Shake Intensity: <br><span>" +
              parseFloat(shake_intensity_radius).toFixed(2) +
              "</span>"
          );
      })
      .on("mouseout", function (d) {
        tooltip.style("display", "none");
      });

    g.attr("opacity", 0)
      .transition()
      .delay(500)
      .transition()
      .attr("opacity", 1);
  },
};
