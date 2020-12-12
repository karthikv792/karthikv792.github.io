const margin = {top: 20, right: 20, bottom: 50, left: 30};
var width =720 - margin.left - margin.right;
var height =820 - margin.top - margin.bottom;    
var shift = 370;
var thresh=60;
var colorScale = d3.scaleOrdinal()
.range(["#98abc5", "#8a89a6"]);
document.addEventListener("DOMContentLoaded",function(){
    myviz1 = d3.select("#myviz1").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    myviz2 = d3.select("#myviz2").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    myviz1.append("text").attr("transform", "translate("+shift+","+(height+50)+")").text("Wins as Percentage For Each Opening").style("font-family","var(--font3)").style("fill","var(--color)")
    myviz2.append("text").attr("transform", "translate("+shift+","+(height+50)+")").text("Wins as Numbers For Each Opening").style("font-family","var(--font3)").style("fill","var(--color)")
    legend = d3.select("#legend").attr("width", 300).attr("height",50)
    legend.append("text").attr("transform", "translate(5,20)").text("Winner").style("font-family","var(--font3)").style("fill","var(--color)")
    legend.append("text").attr("transform", "translate(80,20)").text("-").style("font-family","var(--font3)").style("fill","var(--color)")
    legend.append("text").attr("transform", "translate(130,20)").text("White").style("font-family","var(--font3)").style("fill","var(--color)")
    legend.append("text").attr("transform", "translate(230,20)").text("Black").style("font-family","var(--font3)").style("fill","var(--color)")
    legend.append("rect")
    .attr("y",5)
    .attr("x",100)
    .attr("width",20).attr("height",20).style("fill","white")
    legend.append("rect")
    .attr("y",5)
    .attr("x",200)
    .attr("width",20).attr("height",20).style("fill","grey")
    Promise.all([d3.csv("data/games.csv"),d3.json("data/winperc.json")]).then(function(values){
        total = values[0]
        winperc = values[1]
        drawMap1()
        drawMap2()
        
    })

})

function drawMap1(){
    
    var yScale = d3.scaleBand().domain(winperc.data.map(function(d){return d.opening}))			// x = d3.scaleBand()	
    .rangeRound([0, height])	// .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var xScale = d3.scaleLinear().domain([0,1])		// y = d3.scaleLinear()
    .rangeRound([shift, width]);	// .rangeRound([height, 0]);
// console.log(Object.values(winperc))

    keys = ["white","black"]
    myviz1
    .selectAll("g")
    .data(d3.stack().keys(["white","black"])(winperc.data))
    .enter().append("g").attr("class","allrects")
      .attr("fill", function(d) { if(d[0][1]==1)return "grey";else return "white" })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return yScale(d.data.opening); })	    //.attr("x", function(d) { return x(d.data.State); })
      .attr("x", function(d) { return xScale(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	
      .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("height", yScale.bandwidth());
      
    	
// console.log(d3.stack().keys(["white","black"])(winperc.data))
myviz1.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+shift+",0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(yScale));									//   .call(d3.axisBottom(x));

      myviz1.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(xScale).tickFormat(d=>{return d*100}))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    // .append("text")
    //   .attr("y", 2)												//     .attr("y", 2)
    //   .attr("x", xScale(xScale.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
    //   .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
    //   .attr("fill", "#000")
    //   .attr("font-weight", "bold")
    //   .attr("text-anchor", "start")
    //   .text("Population")
    //   .attr("transform", "translate("+ (-width) +",-10)");   	// Newline
    
}

function drawMap2(){
    openings = preprocess()
    openings = openings.filter(function(d){
        if(d.white + d.black >=thresh){
            return true;
        }
        else return false;
    }).sort((a,b)=>((a.white)<(b.white))?1:-1)
    keys = ["white","black"]
    var xScale0 = d3.scaleBand()
    .domain(openings.map(function(d){return d.opening}))
    .rangeRound([0, height])
    .paddingInner(0.1)
    var xScale1 = d3.scaleBand()
    .domain(keys)
    .rangeRound([0, xScale0.bandwidth()])
    .padding(0.05)
    // console.log([0,d3.max([d3.max(openings,function(d){return d.white}),d3.max(openings,function(d){return d.black})])])
    var yScale = d3.scaleLinear().domain([0,d3.max([d3.max(openings,function(d){return d.white}),d3.max(openings,function(d){return d.black})])])			// x = d3.scaleBand()	
    .range([shift, width]);	



    
    //DRAW
    myviz2 .selectAll("g")
    .data(openings)
    .join("g").attr("transform", d => `translate(0,${xScale0(d.opening)})`) 
    .selectAll("rect")
    .data(d => keys.map(key => ({key, value: d[key]})))
    .join("rect")
      .attr("y", d => xScale1(d.key))
      .attr("x", d => yScale(0))
      .attr("height", xScale1.bandwidth())
      .attr("width", d => {return yScale(d.value) - yScale(0)})
      .attr("fill", d => {if(d.key=="white")return "white"; else return "grey";});

      //AXES

      myviz2.append("g").attr("class", "axis")
      .attr("transform", "translate(0,"+height+")")	
    .call(d3.axisBottom(yScale).tickSizeOuter(0))
    // .call(g => g.select(".domain").remove())

    myviz2.append("g").attr("class", "axis")
    .attr("transform", "translate("+shift+",0)") 			
    .call(d3.axisLeft(xScale0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone())
        // .attr("x", 3)
        // .attr("text-anchor", "start")
        // .attr("font-weight", "bold")
        // .text(data.y))
}
function preprocess(){
    openings = {}
    allwinperc = []
    winperc.data.forEach(d=>{allwinperc.push(d.opening)})
    total.forEach(function(data){
        if(allwinperc.includes(data["opening_name"])){
            
        
        if(Object.keys(openings).includes(data["opening_name"])){
            if(data.winner=="white"){
                openings[data["opening_name"]]['white']+=1
            }
            else if(data.winner=="black"){
                openings[data["opening_name"]]['black']+=1
            }
        }
        else{
            if(data.winner=="white"){
                openings[data["opening_name"]]={'opening':data["opening_name"],'white':1,'black':0}
            }
            else if(data.winner=="black"){
                openings[data["opening_name"]]={'opening':data["opening_name"],'white':0,'black':1}
            }
            // visited.push(data["opening_name"]);
            
        }
    }
    })
    open_list = []
    for (var j in allwinperc){
        open_list.push(openings[allwinperc[j]])
    }
    return open_list//Object.values(openings)
    // def openings(df):
    // openings = {}
    // for iter,row in df.iterrows():
    //     if row["opening_name"] in openings.keys():
    //         openings[row["opening_name"]]+=1
    //     else:
    //         openings[row["opening_name"]]=1
    
    // return sorted(openings.items(),key=lambda x:x[1],reverse=True)
}