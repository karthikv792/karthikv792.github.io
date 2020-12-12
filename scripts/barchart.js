const marginBar = { top: 20, right: 20, bottom: 50, left: 50 };
var widthBar = -marginBar.left - marginBar.right;
var heightBar = -marginBar.top - marginBar.bottom;
document.addEventListener("DOMContentLoaded", function () {
  // rectt = document.getElementById('plot-container').getBoundingClientRect();
  widthBar += 220;
  heightBar += 180;
  b_map = d3
    .select("#barchart")
    .attr("width", widthBar)
    .attr("height", heightBar);
  x_barScale = d3
    .scaleBand()
    .range([0, 160])
    .domain([6, 7, 8, 9, 10, 11])
    .padding(0.7);
  y_barScale = d3.scaleLinear().domain([0, 10]).range([heightBar, 0]);
  flag_bar = 0;
});
var map;
// function drawBar(){
// }
// function updateBar(x){
//     // console.log(x)
//     //Gets the nearest 5th minute time
//     var coeff = 1000 * 60 * 5;
//     var rounded = new Date(Math.round(x.getTime() / coeff) * coeff)
//     // console.log("Rounded",rounded)
//     //Gets the next 5th minute time
//     rounded.setMinutes(rounded.getMinutes()+5)
//     // console.log("Nearest",rounded)
//     // "%Y-%m-%d %H:%M:%S"
//     checkdate = d3.timeFormat("%Y-%m-%d %H:%M:%S")
//     // handle.attr("cx",sliderScale(x));
//     bisect = d3.bisector(d=>d.time).left
//     // console.log(checkdate(rounded),bisect(timeData,checkdate(rounded)))
//     const bisected = bisect(barData,checkdate(rounded),-1)
//     var checkdate1 = d3.timeFormat("%Y-%m-%d %H:%M:%S")
//     //var x_axis_value = checkdate1(x)
//     var x_axis_value = x.getDate()
//     //console.log(checkdate1(x))
//     barchart(bisected, x_axis_value,x)
// }
function barchart(bisected, x_axis_value, x_initial, location) {
  // console.log("VBAR")
  //console.log(x_axis_value)
  // d3.select("#barchart").selectAll('*').remove()

  // console.log(x_initial)

  var checkdate2 = d3.timeFormat("%Y-%m-%d %H:%M:%S");
  // console.log("F",checkdate2(x_initial))
  var final_x = new Date(x_initial);
  var bisected1 = bisected;
  var store_val = eval(barData[bisected - 1]["ImpactAndDamagePerDay"]);
  var list_val = [];
  var y_val;
  var max_y = 0;
  for (var i in store_val) {
    var mini_list = [];
    if (store_val[i][0] == location) {
      mini_list = mini_list.concat(store_val[i][1]);
      y_val = mini_list[0] / mini_list[2];
      list_val = list_val.concat({
        x1: x_axis_value,
        y1: y_val,
        location: location,
      });
      if (max_y < y_val) {
        max_y = y_val;
      }
    }
  }
  //console.log(eval(timeData[bisected1-1]["ImpactAndDamagePerDay"]))
  while (final_x.getDate() != 6) {
    // console.log(final_x.getDate())
    new_date = final_x;
    new_date.setHours(0, 0, 0, 0);
    // console.log(new_date)

    if (new_date.getDate() == 6) break;
    // console.log(new_date)
    final_x = new_date;
    bisected1 = bisect(main_dict, new_date, -1);
    store_val = eval(barData[bisected1 - 1]["ImpactAndDamagePerDay"]);
    var checkdate3 = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    new_date.setDate(new_date.getDate() - 1);
    x_list_value = new_date.getDate();
    for (var i in store_val) {
      var mini_list1 = [];
      if (store_val[i][0] == location) {
        mini_list1 = mini_list1.concat(store_val[i][1]);
        y_val = mini_list1[0] / mini_list1[2];
        list_val = list_val.concat({
          x1: x_list_value,
          y1: y_val,
          location: location,
        });
        if (max_y < y_val) {
          max_y = y_val;
        }
        //console.log(list_val);
      }
    }
    // console.log(store_val)
  }
  // console.log(list_val)
  if (flag_bar == 0) {
    var x_axis = b_map
      .append("g")
      .attr("class", "barAxis")
      .attr("transform", "translate(0," + heightBar + ")")
      .call(d3.axisBottom(x_barScale).tickSize(0))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "5,10")
      );

    // x_axis.selectAll("text").remove();

    // add the y Axis
    var y_axis = b_map
      .append("g")
      .attr("class", "barAxis")
      .call(d3.axisLeft(y_barScale).ticks(5).tickSize(0))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.select(".range").remove())
      .call((g) =>
        g
          .selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "5,10")
      );

    // y_axis.selectAll("text").remove();

    // b_map.append("text")
    // .attr("transform","translate(" + (widthBar/2) + " ," + (heightBar +  40) + ")")
    // .style("font-family","sans-serif")
    //  .style("text-anchor","middle")
    //  .style("font-weight","700")
    //  .style("fill","black")
    //  .style("font-size","14px")
    //  .text("Dates in April(04-06-2020 to 04-11-2020)");
    call_bar(list_val);

    flag_bar = 1;
  } else {
    call_bar(list_val);
  }

  // y_barScale.domain([0, max_y]);
  // console.log("y-value")
  // console.log(max_y)
  // append the rectangles for the bar chart

  // add the x Axis

  //console.log(location_name);

  /*b_map.append("text")
          .attr("x", (widthBar / 2))             
          .attr("y", 12 - (margin.top)/2)
          .attr("text-anchor", "middle")  
          .style("font-family","sans-serif")
          .style("font-size", "16px") 
          .style("text-decoration", "underline") 
          .style("font-weight","bold") 
          .text(location_name);*/

  ///

  //   x.domain(data.map(function(d) { return d.date; }));
  //   y.domain([0, d3.max(data, function(d) { return d.ImpactAndDamagePerDay; })]);

  //   b_map.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x));

  // // add the y Axis
  // b_map.append("g")
  //   .call(d3.axisLeft(y));

  //   b_map.append("g")
  //       .attr("class", "x axis")
  //       .attr("transform", "translate(0," + heightBar + ")")
  //       .call(xAxis)
  //     .selectAll("text")
  //       .style("text-anchor", "end")
  //       .attr("dx", "-.8em")
  //       .attr("dy", "-.55em")
  //       .attr("transform", "rotate(-90)" );

  //   b_map.append("g")
  //       .attr("class", "y axis")
  //       .call(yAxis)
  //     .append("text")
  //       .attr("transform", "rotate(-90)")
  //       .attr("y", 6)
  //       .attr("dy", ".71em")
  //       .style("text-anchor", "end")
  //       .text("Value ($)");

  //   b_map.selectAll("bar")
  //       .data(data)
  //     .enter().append("rect")
  //       .style("fill", "steelblue")
  //       .attr("x", function(d) { return x(d.date); })
  //       .attr("width", x.rangeBand())
  //       .attr("y", function(d) { return y(d.value); })
  //       .attr("height", function(d) { return heightBar - y(d.value); });

  //////////////////
}

function call_bar(list_val) {
  b_map
    .selectAll(".bar")
    .data(list_val, (d) => d.location)
    .join("rect")
    .attr("class", "bar")
    .attr("height", function (d) {
      return heightBar - y_barScale(d.y1);
    })
    .attr("width", x_barScale.bandwidth())
    .attr("x", function (d) {
      return x_barScale(d.x1);
    })
    .attr("y", function (d) {
      return y_barScale(d.y1);
    });
}

// function color_bar(bisected){
//   // data = timeData.slice(0,bisected)
//   // console.log(timeData[bisected])

//     cbar = d3.select("#barchart").attr("width", width + margin.left + margin.right)
//                .attr("height", height + margin.top + margin.bottom)

//     //bar = cbar.append('g');

// var x = d3.scaleBand()
//       .range([0, width])
//       .padding(0.1);
// var y = d3.scaleLinear()
//       .range([height, 0]);

//     d3.csv("data/sales.csv").then(function(data) {

//       // format the data
//       data.forEach(function(d) {
//         d.sales = +d.sales;
//       });

//       // Scale the range of the data in the domains
//       x.domain(data.map(function(d) { return d.salesperson; }));
//       y.domain([0, d3.max(data, function(d) { return d.sales; })]);

//       // append the rectangles for the bar chart
//       cbar.selectAll(".bar")
//           .data(data)
//         .enter().append("rect")
//           .attr("class", "bar")
//           .attr("x", function(d) { return x(d.salesperson); })
//           .attr("width", x.bandwidth())
//           .attr("y", function(d) { return y(d.sales); })
//           .attr("height", function(d) { return height - y(d.sales); });

//       // add the x Axis
// cbar.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

// // add the y Axis
// cbar.append("g")
//     .call(d3.axisLeft(y));

//     });

// }
