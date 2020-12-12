/*TODO: 
2. tick format
3. tick line color
4. Orbital
5. 
*/
const margin = {top: 20, right: 20, bottom: 50, left: 30};
var width = - margin.left - margin.right;
var height = - margin.top - margin.bottom;
var year_value;
dogs = {};
dates = [];
flag=0;
document.addEventListener("DOMContentLoaded",function(){
    format = d3.timeFormat("%Y");
    width +=1120;
    height += 720;
    height_adjustment=30;
//create tabs
    tabs = d3.select("ul")
    yearList = ["1951","1954","1955","1956","1957","1958","1959","1960","1961","1966"]
    for (var i in yearList){
    li = tabs.append("li").attr("class","nav-item m-1");
    aa = li.append("a")
    if(i==0){
        aa.attr("class","nav-link")
    }
    else{
        aa.attr("class","nav-link")
    }
    aa.attr("id","tab"+String(i))
    aa.attr("data_id",String(i+1))
    aa.attr("data-toggle","tab")
    // aa.attr("href","#toSvg")
    aa.html(yearList[i]);
    }
    year_value = +($("ul#myTabs li a.active").html())
    $('.nav li a').click(function(){
        year_value = ($(this).html());
        // console.log(year_value)
        if(year_value!="All"){
            if(flag==1){
                d3.select("#myviz").selectAll("*").remove();
                flag=0;
            }
            year_value = +year_value;
            drawMap()
        }
        else{
            d3.select("#myviz").selectAll("*").remove();
            draw_all()
            flag=1;
        }
       
	});

    Promise.all([d3.csv("data/Dogs-Database.csv"),d3.csv("data/flights.csv"),d3.csv("data/dogsDates.csv")]).then(function(values){
        dogData = values[0];
        flightData1 = values[1];
        dogsDates = values[2];
        flightData1.forEach(d => {
            d.date = new Date(d.Date.replaceAll('-','/'));
            // console.log(d.date, d.Date)
            d.altitude = d["Altitude (km)"];
        });
        dogsDates.forEach(d => {
            d.date = new Date(d.Dates);
            d.date = format(d.date)
            // console.log(format(d.date))
            if(!dates.includes(d.date))
                {dates.push(d.date);}
        });
        find_gender();  
        addLegends();
       
    })
    
    // document.getElementById("year").addEventListener("change",function(){
    //     drawMap()
    // })
    
})

function find_gender(){
    dogData.forEach(function(d){
        dogs[d["Name (Latin)"]]=d["Gender"]
    });
}
function drawMap(){
    d3.select("#myviz").selectAll(".xaxiss").remove();
    d3.select("#myviz").selectAll(".yaxiss").remove();
    // year_value = document.getElementById("year").value;
        flightData = flightData1.filter(function(d){if (d.date.getFullYear()==year_value && +d.altitude != -1) return d; })
        // console.log(dogData, flightData)
        
    
    svg = d3.select("#myviz").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    extent = d3.extent(flightData,function(d){return d.date})
    // console.log(extent)
    extent0 = new Date(extent[0])
    extent1 = new Date(extent[1])
    extent0.setMonth(extent0.getMonth()-1)
    extent1.setMonth(extent1.getMonth()+1)
    // console.log(extent)
    xScale = d3.scaleTime().domain([extent0,extent1]).range([0,width])
    maxx = d3.max(flightData,function(d){return d.altitude})
    // console.log(maxx,flightData1)
    yScale = d3.scaleLinear().domain([0,+maxx+100]).range([height,0])
    const xAxis = d3.axisBottom(xScale).tickFormat((d,i)=>{formattick = d3.timeFormat("%b-%d");return formattick(d)});
    svg.append("g").attr("class","xaxiss")
        .attr("transform", "translate("+margin.left+"," + (height+height_adjustment) + ")")
        .call(xAxis)
        .attr("font-family","Lato");
    const yAxis = d3.axisLeft(yScale).tickSize(width);
        svg.append("g").attr("class","yaxiss")
        .attr("transform", "translate("+(width+margin.left)+","+height_adjustment+")")
        .call(yAxis).call(g => g.select(".domain")
        .remove())
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
    .style("stroke","gray")
        .attr("stroke-opacity", 1)
        .attr("stroke-dasharray", "5,10")).attr("font-family","Lato");
    plotMap()
    
}
function generatePointOnCircle(angle,w,h){//in degree
    var rads = angle/180*Math.PI;
    var r = Math.sqrt(w*w + h*h);
    var x = Math.cos(rads)*r;
    var y = Math.sin(rads)*r;
  
    return {x:x,y:y};
  }
  
function plotMap(){
    waitTime = 3500
    start_index = flightData[0][""]
    dot =  svg.selectAll(".dots").data(flightData, d=>d.date)//.join("circle")
    // .enter().append("circle")
    .join(
        enter =>{
            // console.log(height+height_adjustment+10)
            d3.selectAll('.dots1').remove()
            // const axis_text= enter.append('g').attr("class","axis-text").attr("transform", "translate("+margin.left+","+(height+height_adjustment)+")");
            // const text = axis_text.append('text').attr("class","anytext")
            //APPEND g
            const g = enter.append('g').attr("class","dots justify-content-center").attr('id',function(d){return 'each_g'+d[""]}).attr("transform", (d,i)=>"translate("+(xScale(d.date)+margin.left)+","+(height+height_adjustment+10)+")");
            //APPEND ROCKET
            // g.append("image").attr("xlink:href","images/rocket.webp").style("height",'70px');
            g.append('text').attr("class","glyp").attr('id',function(d){return 'rocket_up'+d[""]}).classed("fa-rotate-270",true).attr('font-family', 'FontAwesome')
            .attr('font-size', '2em' ).text(function(d) { return '\uf197' }).style('cursor','pointer').style("text-anchor","middle").style("text-shadow","0 0 2px red").style('opacity',0);
            //APPEND ALTITUDE
           
            //TRANSITION ROCKET
            g.each(function(d,i){
                // console.log(i,d.altitude)
                if(+d.altitude>0){
                    d3.select('#each_g'+d[""]).append('text').attr('class','altitudes').attr("id",'altitudes'+d[""]);
                    //line
                svg.append("line").attr('id','linedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(+d.altitude)+height_adjustment+10)+")")
                .style("stroke-dasharray", ("3, 3")).attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", t=>{if(+d.altitude>=0) return height - yScale(+d.altitude)-10; else if(+d.altitude==-2) return height - yScale(20); else if(+d.altitude==-3) return height-yScale(0) })
                //y-line
                svg.append("line").attr('id','ylinedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(+d.altitude)+height_adjustment)+")")
                .style("stroke-dasharray", ("3, 3")).attr("x2", 0)
                .attr("y1", 0)
                .attr("x1", -(xScale(d.date)))
                .attr("y2", 0)
                        }
                        else if(+d.altitude==-2){

                            d3.select('#each_g'+d[""]).append('text').attr('class','altitudes').attr("id",'altitudesOrb'+d[""]).style("opacity",0);
                            //line
                svg.append("line").attr('id','linedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(20)+height_adjustment+10)+")")
                .style("stroke-dasharray", ("3, 3")).attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", t=>{if(+d.altitude>=0) return height - yScale(+d.altitude)-10; else if(+d.altitude==-2) return height - yScale(20); else if(+d.altitude==-3) return height-yScale(0) })
                //y-line
                svg.append("line").attr('id','ylinedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(20)+height_adjustment)+")")
                .style("stroke-dasharray", ("3, 3")).attr("x2", 0)
                .attr("y1", 0)
                .attr("x1", -(xScale(d.date)))
                .attr("y2", 0)
                            
                        }
                        else if(+d.altitude==-3){
                            if(eval(d["Result"].includes(12))){
                                svg.append("line").attr('id','linedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(0)+height_adjustment+10)+")")
                .style("stroke-dasharray", ("3, 3")).attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", t=>{if(+d.altitude>=0) return height - yScale(+d.altitude)-10; else if(+d.altitude==-2) return height - yScale(20); else if(+d.altitude==-3) return height-yScale(0) })
                //y-line
                svg.append("line").attr('id','ylinedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(0)+height_adjustment)+")")
                .style("stroke-dasharray", ("3, 3")).attr("x2", 0)
                .attr("y1", 0)
                .attr("x1", -(xScale(d.date)))
                .attr("y2", 0)
                            }
                            else{
                                svg.append("line").attr('id','linedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(20)+height_adjustment+10)+")")
                                .style("stroke-dasharray", ("3, 3")).attr("x1", 0)
                                .attr("y1", 0)
                                .attr("x2", 0)
                                .attr("y2", t=>{if(+d.altitude>=0) return height - yScale(+d.altitude)-10; else if(+d.altitude==-2) return height - yScale(20); else if(+d.altitude==-3) return height-yScale(0) })
                                //y-line
                                svg.append("line").attr('id','ylinedot'+d[""]).style("opacity",0).style("stroke-width",1) .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(20)+height_adjustment)+")")
                                .style("stroke-dasharray", ("3, 3")).attr("x2", 0)
                                .attr("y1", 0)
                                .attr("x1", -(xScale(d.date)))
                                .attr("y2", 0)
                            }
                            d3.select('#each_g'+d[""]).append('text').attr('class','altitudes').attr("id",'altitudesSub'+d[""]).style("opacity",0);
                            //line
                
                        }
                
                if(+d.altitude>=0){
                d3.select('#rocket_up'+d[""]).transition().delay(i*waitTime).duration(500).style("opacity",1);
                d3.select('#each_g'+d[""]).transition().delay(i*waitTime + 500).duration(2000).ease(d3.easeLinear)
                .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(+d.altitude)+height_adjustment+10)+")")
                d3.select('#altitudes'+d[""]).transition().delay(i*waitTime + 500).duration(2000).ease(d3.easeLinear).textTween(function(d) {return t => `${Math.floor(t.toFixed(6)*(+d.altitude))}`})
                d3.select('#altitudes'+d[""]).transition().delay(i*waitTime + 3000).style('opacity',1).transition().duration(1000).style('opacity',0);
                d3.select('#rocket_up'+d[""]).transition().delay(i*waitTime + 3500).style('opacity',0).transition().duration(1000).style('opacity',1).attr("class","glyp").text('\uf1b0').style("fill","#ce8f5a").style("stroke","black");
                }
                else{
                    if(+d.altitude==-2){
                        // console.log(d.altitude)
                        
                        var distance = 73;
                        d3.select('#rocket_up'+d[""]).transition().delay(i*3000).duration(500).style("opacity",1);
                        // d3.select('#altitudes'+d[""]).style("opacity",0).transition().delay(i*5000).duration(500).style("opacity",1);
                        d3.select('#each_g'+d[""]).transition().delay(i*3000).duration(2000)
                        .attrTween("transform",function(){
                        var it = d3.interpolateRound(1,360);
                        return function(t){
                            
                        var p = generatePointOnCircle(it(t),20,20);
                        // console.log(p)
                        return "translate(" + (p.x + xScale(d.date)+margin.left) + "," + (p.y + (height))+")";
                        }
                    
                        });
                        d3.select('#each_g'+d[""]).transition().delay(i*3000 + 2000).duration(1000).ease(d3.easeLinear)
                .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(20)+height_adjustment)+")")
                        d3.select('#altitudesOrb'+d[""]).transition().delay(i*3000 + 500).text("Orbital").transition().duration(500).style("opacity",1)
                        d3.select('#altitudesOrb'+d[""]).transition().delay(i*3000 + 3000).style('opacity',1).transition().duration(200).style('opacity',0);
                        d3.select('#rocket_up'+d[""]).transition().delay(i*3000 + 3500).style('opacity',0).transition().duration(1000).style('opacity',1).attr("class","glyp").text('\uf1b0').style("fill","#ce8f5a").style("stroke","black");
                        
                    }
                    if(+d.altitude==-3){
                        if(eval(d["Result"].includes(12))){
                            d3.select('#rocket_up'+d[""]).transition().delay(i*3000).duration(500).style("opacity",1);
                            d3.select('#rocket_up'+d[""]).transition().delay(i*3000 + 500).duration(2000).style("stroke","#ff7a00")
                            d3.select('#rocket_up'+d[""]).transition().delay(i*3000 + 500).duration(3000).style("fill","#ff7a00");
                            d3.select('#altitudesSub'+d[""]).transition().delay(i*3000).text("Exploded During Launch").transition().duration(500).style("opacity",1)
                        d3.select('#altitudesSub'+d[""]).transition().delay(i*3000 + 3000).style('opacity',1).transition().duration(200).style('opacity',0);
                            d3.select('#rocket_up'+d[""]).transition().delay(i*3000 + 3500).style('opacity',0).transition().duration(1000).style('opacity',1).attr("class","glyp").text('\uf7e4').style("fill","#ff7a00").style("stroke","black");
                        }
                        else{
                        var distance = 73;
                        d3.select('#rocket_up'+d[""]).transition().delay(i*3000).duration(500).style("opacity",1);
                        // d3.select('#altitudes'+d[""]).style("opacity",0).transition().delay(i*5000).duration(500).style("opacity",1);
                        d3.select('#each_g'+d[""]).transition().delay(i*3000).duration(2000)
                        .attrTween("transform",function(){
                        var it = d3.interpolateRound(1,180);
                        return function(t){
                            
                        var p = generatePointOnCircle(it(t),20,20);
                        // console.log(p)
                        return "translate(" + (p.x + xScale(d.date)+margin.left) + "," + (p.y + (height))+")";
                        }
                    
                        });
                        d3.select('#each_g'+d[""]).transition().delay(i*3000 + 2000).duration(1000).ease(d3.easeLinear)
                .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(20)+height_adjustment+10)+")")
                        d3.select('#altitudesSub'+d[""]).transition().delay(i*3000).text("Sub-Orbital").transition().duration(500).style("opacity",1)
                        d3.select('#altitudesSub'+d[""]).transition().delay(i*3000 + 3000).style('opacity',1).transition().duration(200).style('opacity',0);
                        d3.select('#rocket_up'+d[""]).transition().delay(i*3000 + 3500).style('opacity',0).transition().duration(1000).style('opacity',1).attr("class","glyp").text('\uf1b0').style("fill","#ce8f5a").style("stroke","black");
                    }
                        
                    }
                }

            })
            // console.log(pres_glyph)
            // pres_glyph.transition().delay(function(d,i){console.log(d);return i*waitTime}).duration(500).style("opacity",1);
            // g.transition().delay(function(d,i){console.log(flightData.length);return i*waitTime}).select('#each_g'+d[""]).transition().duration(2000).ease(d3.easeLinear)
            // .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(+d.altitude)+height_adjustment+10)+")")
            // g.transition().delay(function(d,i){console.log(flightData.length);return i*waitTime}).select('#glyph'+d[""]).transition().delay(3500).style('opacity',0).transition().duration(1000).style('opacity',1).attr("class","glyp").text('\uf1b0').style("fill","#ce8f5a").style("stroke","black");
            // g.transition().delay(function(d,i){console.log(flightData.length);return i*waitTime}).select('#altitudes'+d[""]).style('opacity',1).transition().delay(3500).duration(1000).style('opacity',0);
            // // g.transition().delay(function(d,i){console.log(flightData.length);return i*waitTime}).on('end',function(d){
            //     enter.select('#glyph'+d[""]).transition().duration(500).style("opacity",1);
            //     enter.select('#each_g'+d[""]).transition().duration(2000).ease(d3.easeLinear)
                // .attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(yScale(+d.altitude)+height_adjustment+10)+")");
            //     console.log(d)
            //     enter.select('#glyph'+d[""]).transition().delay(3500).style('opacity',0).transition().duration(1000).style('opacity',1).attr("class","glyp").text('\uf1b0').style("fill","#ce8f5a").style("stroke","black");
            //     enter.select('#altitudes'+d[""]).style('opacity',1).transition().delay(3500).duration(1000).style('opacity',0);
            //     console.log(enter.select('#glyph'+d[""]));
            // })
            // b1.transition().delay(3000).on('end',function(d){
               
            //     g.select('#glyph'+d[""]).text('\uf1b0').classed("fa-rotate-270",false).style('opacity',0).transition().duration(1000).style('opacity',1).style("fill","#ce8f5a").style("stroke","black");
            //     g.select('#altitudes'+d[""]).transition().duration(1000).style('opacity',0);
            //     // appendCard(d)
            // })
            const g1 = enter.append('g').attr("class","dots1 justify-content-center").attr('id',function(d){return 'glyph2'+d[""]}).attr("transform", (d,i)=>"translate("+(xScale(d.date)+margin.left)+","+(yScale(+d.altitude)+height_adjustment+10)+")")
            .append('text').attr('class','glyp2').classed("fa-rotate-90",true).attr('font-family', 'FontAwesome')
            .attr('font-size', '2em' ).text(function(d) { return '\uf197' }).style("text-shadow","0 0 2px red").style("stroke","white").style('opacity',0)
            //.transition().delay(function(d){return +d[""]*3000 + flightData.length*3000}).style('opacity',1);
            // console.log("end")
            g1.transition().delay(function(d){return (+d[""]-start_index)*3000 + flightData.length*4000}).on('end',function(d){
                if(d.altitude>0){
                enter.select('#glyph2'+d[""]+' text').style("opacity",1)
                enter.select('#glyph2'+d[""]).transition().duration(3000).ease(d3.easeLinear).attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(height+height_adjustment+10)+")");
                enter.select('#glyph2'+d[""]+' text').transition().duration(1500).ease(d3.easeLinear).style("stroke",function(){
                    result = eval(d["Result"]);
                    if((result.includes(0) || result.includes(18)  || result.includes(16))){
                        if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                    } else return "#ED474A"}).transition().duration(1500).style("opacity",0);
                }
                
            })
            
            
            //.transition(t=>t.transition.delay(4000)).transition(t=>t.transition.duration(200)).style('opacity', 0.9)//.attr("r",5).style("stroke","#000000")//.attr("fill",function(d){return colorScheme(getKey(regions_with_countries,d.country))})//.call(getPosition)
            //.call(enter => enter.transition().duration(500).attr("r", 5))//.filter(function(d){if(regions_with_countries[region.value].includes(d.country)==true)return d;}) 
            // g.append("text").transition(t=>t.transition.delay(8000)).transition(t=>t.transition.duration(200)).text(function(d){return d.Dogs}).style("text-anchor","middle").attr("class","anytext")//.style("fill","#ffffff")//.call(getPosition)
            
        },
        exit =>{
            // console.log("Exit")
           
            exit.transition().duration(1000)
          .style('opacity', 0).on('end',function(){
            //   console.log("HELLO:",d3.select(this))
              d3.select(this).remove()
             
          })
          ;

        }
    ) ;

    disp_format = d3.timeFormat("%Y-%m-%d")
     //TOoLTIP
     d3.select("#cardss").selectAll('*').remove();
     card= d3.select("#cardss").attr("class","tooltip").style("border-style","outset").style("opacity",0);
    svg.append("text").attr("id","disp_text_x").style("text-anchor","middle")
    svg.append("text").attr("id","disp_text_y").style("text-anchor","middle")
    //  disp_text.style("opacity",0);
     // column = cards.append("div").attr("class","col-md-4");
    //  card = cards.append('div').attr("class","card m-2").style("width","20rem").style("position","absolute").style("opacity",0);
    //  card_body = card.append("div").attr("class","card-body");
    card_body = card;
     h5 = card_body.append("h5").attr("class","m-3 dogs");
    card_body.append("p").attr("class","m-2 dogs");
    svg.selectAll('.dots').on('mouseover', function(d,i){
        if(d3.select(this).select('.glyp').text()=='\uf1b0' || d3.select(this).select('.glyp').text()=='\uf7e4'){
            h5.text("Members");
            svg.select('#linedot'+d[""]).style("opacity",1).style("stroke",function(){
                result = eval(d["Result"]);
                if((result.includes(0) || result.includes(18)  || result.includes(16))){
                    if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                } else return "#ED474A"})
            svg.select('#ylinedot'+d[""]).style("opacity",1).style("stroke",function(){
                result = eval(d["Result"]);
                if((result.includes(0) || result.includes(18)  || result.includes(16))){
                    if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                } else return "#ED474A"})
            card.style("opacity",0).transition().duration(200).style("opacity",1);
            card.style("box-shadow",function(){
                result = eval(d["Result"]);
                if((result.includes(0) || result.includes(18)  || result.includes(16))){
                    if(result.includes(4)||result.includes(5)||result.includes(6)) return '0 10px 20px #FCD757'; else return "0 10px 20px #75B09C";
                } else return "0 10px 20px #ED474A"});
            // console.log(d.date)
            svg.select("#disp_text_x").style("opacity",1).attr("transform", "translate("+(xScale(d.date)+margin.left)+","+(height+height_adjustment+20)+")").text(disp_format(d.date))
            .style("fill",function(){
                result = eval(d["Result"]);
                if((result.includes(0) || result.includes(18)  || result.includes(16))){
                    if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                } else return "#ED474A"})
            if(+d.altitude>=0){
                svg.select("#disp_text_y").style("opacity",1).attr("transform", "translate(15,"+(yScale(+d.altitude)+height_adjustment+5)+")").text(d.altitude)
                .style("fill",function(){
                    result = eval(d["Result"]);
                    if((result.includes(0) || result.includes(18)  || result.includes(16))){
                        if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                    } else return "#ED474A"})
            }
            else if(+d.altitude==-2){
                svg.select("#disp_text_y").style("opacity",1).attr("transform", "translate(15,"+(yScale(20)+height_adjustment+5)+")").text("Orbital")
                .style("fill",function(){
                    result = eval(d["Result"]);
                    if((result.includes(0) || result.includes(18)  || result.includes(16))){
                        if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                    } else return "#ED474A"})
            }
            else if(+d.altitude==-3){
                if(eval(d["Result"].includes(12))){
                    svg.select("#disp_text_y").style("opacity",1).attr("transform", "translate(15,"+(yScale(0)+height_adjustment+5)+")").text("Was to be Orbital")
                    .style("fill",function(){
                        result = eval(d["Result"]);
                        if((result.includes(0) || result.includes(18)  || result.includes(16))){
                            if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                        } else return "#ED474A"})
                }
                else{
                    svg.select("#disp_text_y").style("opacity",1).attr("transform", "translate(15,"+(yScale(20)+height_adjustment+5)+")").text("Was to be Orbital")
                    .style("fill",function(){
                        result = eval(d["Result"]);
                        if((result.includes(0) || result.includes(18)  || result.includes(16))){
                            if(result.includes(4)||result.includes(5)||result.includes(6)) return '#FCD757'; else return "#75B09C";
                        } else return "#ED474A"})
                }
                
            }
                

            
            d3.selectAll(".yaxiss text").style("opacity",0.1)
            d3.selectAll(".xaxiss text").style("opacity",0.1)
        }
        
       
    }) .on('mousemove', function(d,i){
        if(d3.select(this).select('.glyp').text()=='\uf1b0' || d3.select(this).select('.glyp').text()=='\uf7e4'){
        card.style("left", (d3.event.pageX+10)+"px").style("top", (d3.event.pageY+10)+"px")
    all_dogs = eval(d["Dogs"])
    // result = eval(d["Result"]);
    icon_height = "40"
    e = '';
    for (var dog in all_dogs ){
        e+='<img height='+icon_height+' src="data/dog-astronaut.png"/>'
        if(dogs[all_dogs[dog]]=="Male"){
            e+=' <img height='+icon_height+' src="https://img.icons8.com/dusk/64/000000/male.png"/> '
        }
        else{
            e+=' <img height='+icon_height+' src="https://img.icons8.com/dusk/64/000000/female.png"/> '
        }
        result = eval(d["Result"]);
        
        e+='- '+all_dogs[dog]
        if (result.includes(2)){
            e+=' - <img height='+icon_height+'  src="https://img.icons8.com/dusk/64/000000/halo.png"/>' 
        }
        if (result.includes(4) && all_dogs[dog]=="Mishka-2"){
            e+=' - <img height='+icon_height+'  src="https://img.icons8.com/dusk/64/000000/halo.png"/>'
        }
        if (result.includes(5) && all_dogs[dog]=="Ryzhik-2"){
            e+=' - <img height='+icon_height+'  src="https://img.icons8.com/dusk/64/000000/halo.png"/>'
        }
        if (result.includes(6) && all_dogs[dog]=="Rita"){
            e+=' - <img height='+icon_height+'  src="https://img.icons8.com/dusk/64/000000/halo.png"/>'
        }
        e+='<br>'
        // console.log(all_dogs[dog],dogs[all_dogs[dog]])
    }
    
    if(d["Notes"].includes('Marfusa')){
        e+='<img height='+icon_height+' src="data/rabbit.png"/> - Marfusa'
    }
    if(d["Notes"].includes('Zvezdochka')){
        e+='<img height='+icon_height+' src="data/rabbit.png"/> - Zvezdochka'
    }
    
   card_body.select("p").html(e)
//    svg.select("#disp_text_x").style("opacity",1)
    }})
    .on('mouseout',function(d,i){
        card.style("opacity",1).transition().duration(200).style("opacity",0);
        svg.select('#linedot'+d[""]).style("opacity",0);
        svg.select('#ylinedot'+d[""]).style("opacity",0);
        svg.select("#disp_text_x").style("opacity",0);
        svg.select("#disp_text_y").style("opacity",0);
        d3.selectAll(".yaxiss text").style("opacity",1)
        d3.selectAll(".xaxiss text").style("opacity",1)

    });

}


// function draw_all(){
//     svg = d3.select("#myviz").attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     // extent = d3.extent(flightData1,function(d){return d.date})
//     // // console.log(dogs)
//     // extent0 = new Date(extent[0])
//     // extent1 = new Date(extent[1])
//     // extent0.setMonth(extent0.getMonth()-1)
//     // extent1.setMonth(extent1.getMonth()+1)
//     // console.log(extent)
//     console.log(dates)
//     width1=width-580
//     xScale1 = d3.scaleBand().domain(dates).range([0,width1])
//     // console.log(maxx,flightData1)
//     yScale1 = d3.scaleBand().domain(Object.keys(dogs)).range([height,0])
//     const xAxis = d3.axisBottom(xScale1);
//     svg.append("g").attr("class","xaxiss")
//         .attr("transform", "translate("+margin.left+"," + (height+height_adjustment) + ")")
//         .call(xAxis)
//         .attr("font-family","Lato");
//     const yAxis = d3.axisLeft(yScale1).tickSize(width1);
//         svg.append("g").attr("class","yaxiss")
//         .attr("transform", "translate("+(width1+margin.left)+","+height_adjustment+")")
//         .call(yAxis).call(g => g.select(".domain")
//         .remove())
//     .call(g => g.selectAll(".tick:not(:first-of-type) line")
//     .style("stroke","gray")
//         .attr("stroke-opacity", 1)
//         .attr("stroke-dasharray", "5,10")).attr("font-family","Lato");

//     dot = svg.selectAll('.dots2')
//     .data(dogsDates)
//     gg = dot.enter().append('g').attr("class","dots2 justify-content-center")
//     .attr("transform", (d,i)=>"translate("+(xScale1(d.date)+margin.left+margin.left)+","+(yScale1(d.Dogs)+height_adjustment+10)+")");
//     gg.append('text').attr('font-family', 'FontAwesome')
//             .attr('font-size', '1em' ).text('\uf1b0').style("fill","#ce8f5a").style("stroke","black").style('cursor','pointer').style("text-anchor","middle");

// }

function addLegends(){
    leg = d3.select("#legends").attr("width",950).attr("height",200)
    leg.append("text").attr('font-family', 'FontAwesome')
    .attr('font-size', '2em' ).style('cursor','pointer').style("text-anchor","middle").text('\uf1b0').attr("x",60).attr("y",50).style("fill","#ce8f5a").style("stroke","black")
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Paw on Space').attr("x",60).attr("y",80).style("fill","white")
    
    leg.append("text").attr('font-family', 'FontAwesome')
    .attr('font-size', '2em' ).style('cursor','pointer').style("text-anchor","middle").text('\uf7e4').attr("x",210).attr("y",50).style("fill","#ff7a00").style("stroke","black")
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Exploded at Launch').attr("x",210).attr("y",80).style("fill","white")
    
    
    leg.append("text").attr('font-family', 'FontAwesome').classed("fa-rotate-270",true)
    .attr('font-size', '2em' ).style('cursor','pointer').style("text-anchor","middle").attr("x",-40).attr("y",340).text(function(d) { return '\uf197' }).style("stroke","#1e5480")
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Rocket').attr("x",330).attr("y",80).style("fill","white")
    
   
    leg.append("image").attr("xlink:href","https://img.icons8.com/dusk/64/000000/halo.png").attr("x",410).attr("y",10).attr("height",50)
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Demise of Member').attr("x",440).attr("y",80).style("fill","white")
    
    
    leg.append("image").attr("xlink:href","https://img.icons8.com/dusk/64/000000/male.png").attr("x",520).attr("y",10).attr("height",50)
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Male').attr("x",540).attr("y",80).style("fill","white")
    
    
    leg.append("image").attr("xlink:href","https://img.icons8.com/dusk/64/000000/female.png").attr("x",590).attr("y",10).attr("height",50)
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Female').attr("x",610).attr("y",80).style("fill","white")
    
    
    leg.append("image").attr("xlink:href","data/dog-astronaut.png").attr("x",680).attr("y",10).attr("height",50)
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Dog Astronaut').attr("x",710).attr("y",80).style("fill","white")
    
    
    leg.append("image").attr("xlink:href","data/rabbit.png").attr("x",810).attr("y",10).attr("height",50)
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Rabbit Astronaut').attr("x",840).attr("y",80).style("fill","white")
    
    //NEW
    leg.append("circle").attr("cx",250).attr("cy",120).attr("r",10).style("fill",'#FCD757')
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Recovery with Casualties').attr("x",250).attr("y",150).style("fill","white")
    
    
    leg.append("circle").attr("cx",450).attr("cy",120).attr("r",10).style("fill",'#75B09C')
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Safe Recovery').attr("x",450).attr("y",150).style("fill","white")
    
    
    leg.append("circle").attr("cx",600).attr("cy",120).attr("r",10).style("fill",'#ED474A')
    leg.append("text").attr('font-family', 'Fredoka One')
    .attr('class', 'legtext' ).style('cursor','pointer').style("text-anchor","middle").text('Failed Recovery').attr("x",600).attr("y",150).style("fill","white")
    
}