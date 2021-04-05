import { createDrawingArea, CrossPlot,LinkPlot } from "../index"

function newDrawingArea(divId){
    
    let div = document.getElementById(divId)
    if(div)
      div.innerHTML =""
    else
      div = <HTMLDivElement>document.createElement("div")
    
    div.id = divId
    document.body.appendChild(div)

    return createDrawingArea(
        {  containerDivId : divId,
           width : 100,
           height :100,
           xmin :  -50,
           ymin :  -50,
           xmax :  50.,
           ymax :  50,
           overflowDisplay:  {left:1e8,right:1e8,top:1e8,bottom:1e8}
      })     
}

function drawEntities(drawingArea, data){

    let plotData={
      plotId:"scatterPlot",
      plotClasses:[],
      drawingArea:drawingArea
    }
   

    let plot = new CrossPlot(plotData)
    plot.draw(data)
}

  
function createLinkPlot(drawingArea){
    
  let plotData={
    plotId:"linkPlot",
    plotClasses:[],
    drawingArea:drawingArea
  }
  return new LinkPlot(plotData)

}

test('simple link plot', () => {

    let drawingArea = newDrawingArea("plot-container")
    
    var jsonCircles = [
      { "id": "input-slot_sIn0_module0","cx": 30, "cy": 30, "r": 20, "fill" : "green" },
      { "id": "output-slot_sOut0_module1","cx": 70, "cy": 70, "r": 20, "fill" : "purple"}
    ] 
    var circles = drawingArea.svgCanvas.selectAll("circle")
                            .data(jsonCircles)
                            .enter()
                            .append("circle");

  circles
  .attr("id", function (d) { return d.id; })
  .attr("cx", function (d) { return d.cx; })
  .attr("cy", function (d) { return d.cy; })
  .attr("x", function (d) { return d.cx; })
  .attr("y", function (d) { return d.cy; })
  .attr("r", function (d) { return d.r; })

  let gIn =document.getElementById("input-slot_sIn0_module0").parentElement
  gIn.setAttribute("x","0")
  gIn.setAttribute("y","0")
  let gOut =document.getElementById("output-slot_sOut0_module1").parentElement
  gOut.setAttribute("x","0")
  gOut.setAttribute("y","0")

  let linkPlot = createLinkPlot(drawingArea)
  let connectionsData = [{
    id:"connection0",
    x:0,
    y:0,
    classes:["entity"],
    inputGroup : gIn,
    outputGroup : gOut,
    data:{
      end :{slotId:"sIn0", moduleId: "module0"},
      start :{slotId:"sOut0", moduleId: "module1"}
    }
  }]
  let g = linkPlot.draw(connectionsData)

  let entity0 = document.getElementById("connection0")
  let t = entity0.getAttribute("transform")
  expect(entity0.getAttribute("transform")).toEqual("translate(50,50)")

})

test('simple link plot with wrong data', () => {

  let drawingArea = newDrawingArea("plot-container")
  
  var jsonCircles = [
    { "id": "input-slot_sIn0_module0","cx": 30, "cy": 30, "r": 20, "fill" : "green" },
    { "id": "output-slot_sOut0_module1","cx": 70, "cy": 70, "r": 20, "fill" : "purple"},
  ] 
  var circles = drawingArea.svgCanvas.selectAll("circle")
                          .data(jsonCircles)
                          .enter()
                          .append("circle");

circles
.attr("id", function (d) { return d.id; })
.attr("cx", function (d) { return d.cx; })
.attr("cy", function (d) { return d.cy; })
.attr("x", function (d) { return d.cx; })
.attr("y", function (d) { return d.cy; })
.attr("r", function (d) { return d.r; })
let gAll = document.getElementById("input-slot_sIn0_module0").parentElement
gAll.setAttribute("x","0")
gAll.setAttribute("y","0")

let linkPlot = createLinkPlot(drawingArea)
let connectionsData = [{
  id:"connection0",
  x:0,
  y:0,
  classes:["entity"],
  inputGroup : gAll,
  outputGroup : gAll,
  data:{
    end :{slotId:"sIn0", moduleId: "module0"},
    start :{slotId:"sOut0", moduleId: "module1"}
  }
},{
  id:"connection1",
  x:0,
  y:0,
  classes:["entity"],
  data:{
    end :{slotId:"sIn0", moduleId: "module1"},
    start :{slotId:"sOut0", moduleId: "module2"}
  }
},{
  id:"connection2",
  x:0,
  y:0,
  classes:["entity"],
  inputGroup : gAll,
  outputGroup : gAll,
  data:{
    end :{slotId:"sIn0", moduleId: "module4"},
    start :{slotId:"sOut0", moduleId: "module3"}
  }
}]

let g = linkPlot.draw(connectionsData)
expect(document.querySelectorAll(".entity").length).toEqual(1)

})
