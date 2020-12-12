radius = 550;
document.addEventListener("DOMContentLoaded", function () {
  i_map = d3
    .select("#innovative")
    .attr("width", width + margin.left + margin.right + 750)
    .attr("height", height + margin.top + margin.bottom + 950);
});
// function arcTween(outerRadius, delay) {
//   return function() {
//     console.log(12)

//   };
// }
/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
var getContrast = function (hexcolor) {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split("")
      .map(function (hex) {
        return hex + hex;
      })
      .join("");
  }

  // Convert to RGB value
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);

  // Get YIQ ratio
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "black" : "white";
};
function checkfunc(x) {
  if (x != "") {
    return 1;
  } else {
    return 0;
  }
}
innov_dict = [];
function innov_preprocess(bisected) {
  score_dict2 = {};
  new_date = new Date(reportsData[bisected - 1]["time"].replaceAll("-", "/"));
  for (var j = 0; j < bisected; j++) {
    // console.log(j)
    if (j == bisected) break;
    n_date = new Date(reportsData[j]["time"].replaceAll("-", "/"));
    // console.log(n_date.getDate(), new_date.getDate())
    if (n_date.getDate() == new_date.getDate()) {
      loct = +reportsData[j]["location"];
      // console.log(loct)
      saw = checkfunc(reportsData[j]["sewer_and_water"]);
      power = checkfunc(reportsData[j]["power"]);
      roads = checkfunc(reportsData[j]["roads_and_bridges"]);
      med = checkfunc(reportsData[j]["medical"]);
      buildings = checkfunc(reportsData[j]["buildings"]);
      si = checkfunc(reportsData[j]["shake_intensity"]);
      // console.log(Object.keys(score_dict2))//[saw, power, roads, med, buildings, si])

      if (Object.keys(score_dict2).includes(String(loct))) {
        // console.log(score_dict2)
        score_dict2[loct]["sewer_and_water"] += saw;
        score_dict2[loct]["power"] += power;
        score_dict2[loct]["roads_and_bridges"] += roads;
        score_dict2[loct]["medical"] += med;
        score_dict2[loct]["buildings"] += buildings;
        score_dict2[loct]["shake_intensity"] += si;
      } else {
        score_dict2[loct] = {};
        score_dict2[loct]["sewer_and_water"] = saw;
        score_dict2[loct]["power"] = power;
        score_dict2[loct]["roads_and_bridges"] = roads;
        score_dict2[loct]["medical"] = med;
        score_dict2[loct]["buildings"] = buildings;
        score_dict2[loct]["shake_intensity"] = si;
      }
    }

    // temp_dict2 = JSON.parse(JSON.stringify(score_dict2))
    // barData.push({"time":reportsData[j]["time"].replaceAll('-','/'),"ImpactAndDamagePerDay":Object.entries(temp_dict2)})
  }
  console.log(score_dict2);
  return score_dict2;
}

function drawInnovative(bisected) {
  i_map.selectAll("*").remove();
  cat_text = {
    shake_intensity: "\uf83e",
    sewer_and_water: "\uf043",
    power: "\uf0e7",
    roads_and_bridges: "\uf018",
    buildings: "\uf1ad",
    medical: "\uf469",
  };
  loc_list1 = innov_preprocess(bisected);
  //eval("(" + reports[bisected]["ReportsPerDay"] + ")");
  arr_group1 = [];
  for (var loc in loc_list1) {
    const sortable = Object.entries(loc_list1[loc]).sort(
      ([, a], [, b]) => a - b
    );

    // console.log(sortable.length)
    list_final = [];
    total_reports = 0;
    for (var j in sortable) {
      final = [];
      if (j == 0) {
        list_final.push("children");
        list_final.push([Object.fromEntries([sortable[j]])]);
      } else {
        final.push("children");
        final.push([Object.fromEntries([sortable[j], list_final])]);
        list_final = final;
      }
      total_reports += +sortable[j][1];
    }
    list_final = [[loc, total_reports / 6], list_final];
    arr_group1.push(Object.fromEntries(list_final));
  }

  color_inn = d3.scaleOrdinal(d3.quantize(d3.interpolateWarm, 19 + 1));
  partition = (data) =>
    d3.partition().size([2 * Math.PI, radius])(
      d3.hierarchy(data).sum((d) => {
        return d[Object.keys(d)[0]];
      })
      //.sort((a, b) => b.value[1] - a.value[1])//.sort(d=>{d.data.value[1]})
    );
  grouping = d3.group(mapData.features, (d) => d.properties.Id);

  arr_group = Array.from(grouping, ([key, value]) => ({
    key,
    value: value[0].properties.Nbrhood,
  }));

  maps = { name: "map", children: arr_group1 };

  root = partition(maps);
  // console.log(root)
  arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius((d) => {
      if (d.depth == 1) return d.y0;
      else return d.y0 + extra_width;
    })
    .outerRadius((d) => {
      if (d.depth == 1) return d.y1 - 5;
      else return d.y1 - 5 + extra_width;
    })
    .cornerRadius(4);
  posX = 500;
  scale_glyph = d3.scaleLinear().range([10, 25]);
  padAngles = [];
  extra_width = 20;
  temp = {};
  // ARCS
  var outerRadius = height / 2 - 20;
  i_map
    .append("g")
    .attr("fill-opacity", 0.6)
    .attr("transform", "translate(" + posX + "," + (height + 350) + ")")
    .selectAll("paths")
    .data(root.descendants().filter((d) => d.depth))
    .join(function (enter) {
      const g = enter
        .append("g")
        .attr("class", "paths")
        .attr("id", (d, i) => {
          padAngles.push(d.x1 - d.x0);
          temp[i] = d.y1;
          if (d.depth > 1) {
            dep = d.depth;
            while (d.depth > 1) d = d.parent;
            return "gchildren" + String(dep) + String(Object.keys(d.data)[0]);
          } else {
            return "gparent" + String(Object.keys(d.data)[0]);
          }
        });
      g.append("path")
        .attr("class", (d, i) => {
          if (d.depth > 1) {
            while (d.depth > 1) d = d.parent;
            return "children" + String(Object.keys(d.data)[0]);
          } else {
            return "parent" + String(Object.keys(d.data)[0]);
          }
        })
        .attr("id", (d, i) => {
          if (d.depth > 1) {
            dep = d.depth;
            while (d.depth > 1) d = d.parent;
            return "children" + String(dep) + String(Object.keys(d.data)[0]);
          } else {
            return "parent" + String(Object.keys(d.data)[0]);
          }
        })
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color_inn(Object.keys(d.data)[0]);
        })
        .attr("fill-opacity", "1")
        .attr("opacity", (d) => {
          if (d.depth > 1) return 0;
          else return 1;
        })
        .attr("d", arc)
        .on("mouseover", (d, i) => {
          // arcTween(outerRadius, 0);
          dep = d.depth;
          if (d.depth == 1) {
            d3.select("#parent" + String(Object.keys(d.data)[0]))
              .transition()
              .delay(100)
              .attrTween("d", function () {
                var z = d3.interpolate(d.y1, temp[i] + extra_width);
                return function (t) {
                  d.y1 = z(t);
                  return arc(d);
                };
              });
            d3.selectAll(".children" + String(Object.keys(d.data)[0]))

              .transition()
              .delay(200)
              .duration(400)
              .attr("opacity", 1);
          }
        })
        .on("mouseout", (d, i) => {
          // arcTween(outerRadius- 20, 150)
          // console.log(click_flag[+d.properties.Id])

          if (d.depth == 1) {
            if (click_flag[+Object.keys(d.data)[0]] == 0) {
              d3.select("#parent" + String(Object.keys(d.data)[0]))
                .transition()
                .delay(150)
                .attrTween("d", function () {
                  var z = d3.interpolate(d.y1, temp[i]);
                  return function (t) {
                    d.y1 = z(t);
                    return arc(d);
                  };
                });
              d3.selectAll(".children" + String(Object.keys(d.data)[0]))

                .transition()
                .duration(400)
                .attr("opacity", 0);
            }
          }
        });
      g.append("text")
        .attr("class", (d, i) => {
          if (d.depth > 1) {
            while (d.depth > 1) d = d.parent;
            return "children" + String(Object.keys(d.data)[0]);
          } else {
            return "parent" + String(Object.keys(d.data)[0]);
          }
        })
        .attr("text-anchor", "middle")
        .attr("font-family", "FontAwesome")
        .attr("font-size", function (d, i) {
          scale_glyph.domain(d3.extent(padAngles));
          return String(scale_glyph(d.x1 - d.x0)) + "px";
        })
        .text(function (d, i) {
          if (d.depth > 1 && d.value != 0) {
            return cat_text[Object.keys(d.data)[0]];
          }
        })
        .attr("transform", function (d, i) {
          if (d.depth > 1) {
            var x = arc.centroid(d)[0];
            var y = arc.centroid(d)[1];
            return "translate(" + x + "," + y + ")";
          }
        })
        .style("fill", function (d) {
          //     while (d.depth > 1) d = d.parent;
          // return getContrast(color(Object.keys(d.data)[0]))
          return "black";
        })
        .style("fill-opacity", 1)
        .attr("opacity", 0);
      // g.append("image").attr("xlink:href",function(d,i){

      //   if(d.depth>1 && d.value!=0){
      //     // console.log(d)
      //     return "images/water.png"
      //   }
      //   else return ""
      // }).attr("height",(d,i)=>{if (d.depth>1)return 20; else return 0;}).attr("transform",
      // function(d,i){
      //   if(d.depth>1){
      //     var x = arc.centroid(d)[0];
      //     var y = arc.centroid(d)[1];
      //     return "translate(" + x + "," + y + ")";
      //   }

      // }
      // )
      //   g.each(function(d,i){
      //     if(d.depth>1){
      //       dep=d.depth;
      //       while (d.depth>1) d=d.parent;
      //      const child = enter.select("#gchildren"+String(dep)+String(Object.keys(d.data)[0]))
      //      child
      //     }
      //   })
    });

  // TEXT
  dict_locations = {};
  mapData.features.forEach(function (d) {
    // console.log(d);
    dict_locations[+d.properties.Id] = d.properties.Nbrhood;
  });
  // console.log(dict_locations)
  i_map
    .append("g")
    .attr("transform", "translate(" + posX + "," + (height + 350) + ")")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("font-size", 6)
    .attr("font-weight", 400)
    .attr("font-family", "var(--font)")
    .selectAll("text")
    .data(
      root
        .descendants()
        .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
    )
    .join("text")
    .attr("transform", function (d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      //   console.log(x,y)
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr("dy", "0.35em")
    // .style("font-size","12px")
    .text((d) => {
      if (d.depth == 1) return dict_locations[Object.keys(d.data)[0]];
      else return "";
    })
    .attr("fill", function (d) {
      // while (d.depth > 1) d = d.parent;
      // return getContrast(color(Object.keys(d.data)[0]))
      return "black";
    });
  // .attr("opacity",d=>{if(d.depth>1)return 0;else return 1;});

  //TEXT AT CENTER
  i_map
    .append("g")
    .attr("transform", "translate(" + posX + "," + (height + 350) + ")")
    .attr("pointer-events", "none")
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", 8)
    .attr("font-family", "var(--font)")
    .text("Based on");
  i_map
    .append("g")
    .attr("transform", "translate(" + posX + "," + (height + 360) + ")")
    .attr("pointer-events", "none")
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", 8)
    .attr("font-family", "var(--font)")
    .text("number of reports");

  colorCircles = i_map.selectAll(".colorCircle");

  colorCircles.data(mapData.features).join((enter) => {
    const g = enter
      .append("g")
      .attr("class", "colorCircle")
      .attr("transform", (d, i) => `translate(${-180},${250 + i * 20})`);
    g.append("circle")
      .style("fill", (d, i) => color_inn(+d.properties.Id))
      .attr("r", 8)
      .style("stroke", "black");

    g.append("text")
      .text(function (d) {
        return +d.properties.Id;
      })
      .attr("font-family", "var(--font)")
      .style("font-size", "10px")
      .attr("y", 6)
      //  .style("alignment-baseline", "middle")
      .style("text-anchor", "middle");

    g.append("text")
      .attr("id", function (d) {
        return "textt" + d.properties.Id;
      })
      .style("font", "12px var(--font)")
      .style("cursor", "pointer")
      .attr("transform", (d, i) => `translate(${28},${5})`)
      .text((d) => {
        return d.properties.Nbrhood;
      })
      .on("mouseover", function (d) {
        d3.select("#parent" + d.properties.Id)
          .transition()
          .delay(100)
          .attrTween("d", function (e) {
            // console.log(e)
            var z = d3.interpolate(e.y1, temp[i] + extra_width);
            return function (t) {
              e.y1 = z(t);
              return arc(e);
            };
          });
        d3.selectAll(".children" + d.properties.Id)

          .transition()
          .delay(200)
          .duration(400)
          .attr("opacity", 1);
      })
      .on("mouseout", function (d) {
        if (click_flag[+d.properties.Id] == 0) {
          d3.select("#parent" + d.properties.Id)
            .transition()
            .delay(150)
            .attrTween("d", function (e) {
              var z = d3.interpolate(e.y1, temp[i]);
              return function (t) {
                e.y1 = z(t);
                return arc(e);
              };
            });
          d3.selectAll(".children" + d.properties.Id)

            .transition()
            .duration(400)
            .attr("opacity", 0);
        }
      })
      .on("click", function (d) {
        if (click_flag[+d.properties.Id] == 0) {
          click_flag[+d.properties.Id] = 1;
          g.select("#textt" + d.properties.Id).classed("textclick", true);
        } else {
          click_flag[+d.properties.Id] = 0;
          g.select("#textt" + d.properties.Id).classed("textclick", false);
        }
      });
  });
}
