import { createDrawingArea, CrossPlot } from "../index"
import { take, reduce } from 'rxjs/operators'

function createCrossPlot(divId){
  let div = document.getElementById(divId)
  if(div)
    div.innerHTML =""
  else
    div = <HTMLDivElement>document.createElement("div")
  div.id = divId
  document.body.appendChild(div)

  let drawingArea = createDrawingArea(
    {  containerDivId : divId,
       width : 100,
       height :100,
       xmin :  -50,
       ymin :  -50,
       xmax :  50.,
       ymax :  50,
       margin:0,
       overflowDisplay:  {left:1e8,right:1e8,top:1e8,bottom:1e8}
  })     
  
  let plotData={
    plotId:"simplePlot",
    plotClasses:[],
    drawingArea:drawingArea
  }
  return new CrossPlot(plotData)

}

test('simple cross plot', () => {

  let crossPlot = createCrossPlot("plotTestSimple")
  let entities = [{
    id:"plotTestSimple-entity0",
    x:0,
    y:0,
    classes:["entity"]
  }]
  let groups0 = crossPlot.draw(entities)  
  let entered0 = groups0.entered._groups.map( d =>  d.filter(g=>g)).filter(e=>e.length>0)
  let updated0 = groups0.updated._groups.map( d =>  d.filter(g=>g)).filter(e=>e.length>0)
  expect(entered0.length).toEqual(1)
  expect(updated0.length).toEqual(0)

  let entity0 = document.getElementById("plotTestSimple-entity0")

  expect(entity0.classList.contains("entity")).toEqual(true)
  expect(entity0.getAttribute("transform")).toEqual("translate(50,50)")

  let groups1 = crossPlot.draw(entities)
  let entered1 = groups1.entered._groups.map( d =>  d.filter(g=>g)).filter(e=>e.length>0)
  let updated1 = groups1.updated._groups.map( d =>  d.filter(g=>g)).filter(e=>e.length>0)
  expect(entered1.length).toEqual(0)
  expect(updated1.length).toEqual(1)
  })


test('actions should be plugged ', done => {

  let crossPlot = createCrossPlot("plotTestActions")

  let events = [
    new Event('click'),
    new Event('dblclick'),
    //new Event('mousedown'),  ?? this one is responsible of a weird error
    new Event('mouseover'),
    new Event('mouseout'),
    new Event('mouseup')
  ]

  let entities = [{
    id:"plotTestActions-entity0",
    x:0,
    y:0,
    classes:["entity"]
  }]

  crossPlot.entities$.pipe( 
    take(events.length),
    reduce( (acc,val) => acc.concat(val), [])
  )
  .subscribe( datas => {
    expect(datas.length).toEqual(events.length)
    datas.forEach( (d,i) => expect(d.action).toEqual(events[i].type) )
    expect(datas[0].data.id).toEqual("plotTestActions-entity0")
    expect(datas[0].serie).toEqual(crossPlot)
    done()
  })

  crossPlot.draw(entities)

  let entity0 = document.getElementById("plotTestActions-entity0")
  events.forEach( event =>  entity0.dispatchEvent(event))

  /*
  ReferenceError: DragEvent is not defined ??
  let dragEvents = [
    new DragEvent('dragstart'),
    new DragEvent('drag'),
    new DragEvent('dragend')
  ]
  dragEvents.forEach( event =>  entity0.dispatchEvent(event))
  */
  })
  
  
test('simple cross plot with preprojection', () => {

  let crossPlot = createCrossPlot("plotTestSimple")
  let entities = [{
    id:"plotTestSimple-entity0",
    x:0,
    y:0,
    classes:["entity"],
    projection: (x,y)=>[0,0]
  },{
    id:"plotTestSimple-entity1",
    x:0,
    y:0,
    classes:["entity"],
    projection: (x,y)=>[10,0]
  }]

  crossPlot.draw(entities)
  let entity0 = document.getElementById("plotTestSimple-entity0")
  expect(entity0.getAttribute("transform")).toEqual("translate(50,50)")

  let entity1 = document.getElementById("plotTestSimple-entity1")
  expect(entity1.getAttribute("transform")).toEqual("translate(60,50)")

  })
