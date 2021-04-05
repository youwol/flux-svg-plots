
import * as d3 from 'd3-selection';
import { createDrawingArea, drawShapes } from "../index"
import { toCssName } from '../lib/core';


test('test css name conversion', () => {

  expect(toCssName("a b~c.d:e{f}@g")).toEqual("a-b-c-d-ef-g")
})


test('simple d3 should works', () => {

  var jsonCircles = [
      { "id": "circle0","x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
      { "id": "circle1","x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
      { "id": "circle2","x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}];

  var svgContainer = d3.select("body")
  .append("svg")
  .attr("width", 200)
  .attr("height", 200)
  .append("group");
 
  var circles = svgContainer.selectAll("circle")
                            .data(jsonCircles)
                            .enter()
                            .append("circle");

  circles
    .attr("id", function (d) { return d.id; })
    .attr("cx", function (d) { return d.x_axis; })
    .attr("cy", function (d) { return d.y_axis; })
    .attr("r", function (d) { return d.radius; })
    .style("fill", function(d) { return d.color; });

  let circle0= document.getElementById("circle0")

  expect(circle0.hasAttribute("cx")).toEqual(true)
  expect(circle0.getAttribute("cx")).toEqual("30")
  })


test('simple shapes drawing', () => {

  var svgGroup = d3.select("body")
  .append("svg")
  .attr("width", 200)
  .attr("height", 200)
  .append("group");
  
  //let shapes = drawShapes(svgGroup,[{id:"0",x:0,y:0, classes:[]}], (d)=> "<circle></circle>",)
  //expect(shapes.entered._groups.length).toEqual(1)
})
  

test('drawing area creation', () => {
  
  let div = document.createElement("div")
  div.id = "plot-container"
  document.body.appendChild(div)

  let drawingArea = createDrawingArea(
    {  containerDivId : "plot-container",
        width : 100,
        height :100,
        xmin :  -50,
        ymin :  -50,
        xmax :  50.,
        ymax :  50,
        overflowDisplay:  {left:1e8,right:1e8,top:1e8,bottom:1e8}
  })     
  
  expect(drawingArea.svgCanvas).toBeDefined()
  expect(drawingArea.hScale).toBeDefined()
  expect(drawingArea.vScale).toBeDefined()
})