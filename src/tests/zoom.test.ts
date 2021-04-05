
import { createDrawingArea, ZoomTranslatePolicy} from "../index"

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
    let zoom = new ZoomTranslatePolicy(drawingArea.drawingGroup)
    zoom.apply(drawingArea, {
        transform:{
            x:10,
            y:20,
            k:2
        }
    })

  expect(drawingArea.overallTranform.scale).toEqual(2)
  expect(drawingArea.overallTranform.translateX).toEqual(10)
  expect(drawingArea.overallTranform.translateY).toEqual(20)
  })