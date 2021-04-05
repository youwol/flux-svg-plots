import { Plottable, drawShapes } from "./core";
import { Subject } from "rxjs";


export class CrossPlot extends Plottable {
    
    entities$           = new Subject<any>()
    drawnElements$      = new Subject<any>()
    
    customEntitiesFiltering = undefined

    defaultElementDisplay = (d) =>{ 
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
        g.innerHTML = `<circle height='100' width='50' class='circle' cx="0" cy="0" , r="3" > </circle>` 
        return g
    }

    constructor(  public readonly plotData ){
        super(plotData.plotId,plotData.plotClasses,plotData.drawingArea)          
    }

    draw( entities )  {        

        let plotGroup = this.getPlotGroup(this.plotClasses)        
        let layout    = this.drawingArea.layout 
        let geoms     = entities
        .filter( e => this.customEntitiesFiltering == undefined ? true :
                      this.customEntitiesFiltering(e, this.drawingArea))
        .map( (e,i) => this.geom( e, i ) )
        .filter( geom => geom.x >= layout.marginLeft - this.drawingArea.overflowDisplay.left &&
                         geom.x <= layout.marginLeft + layout.hAxisLength + this.drawingArea.overflowDisplay.right && 
                         geom.y >= layout.marginTop - this.drawingArea.overflowDisplay.top &&
                         geom.y <= layout.marginTop + layout.vAxisLength + this.drawingArea.overflowDisplay.bottom )
        let gs = drawShapes( plotGroup, geoms , this.defaultElementDisplay)
        this.drawnElements$.next( gs )
        
        this.plugActions(gs.entered, this.entities$)
        return gs
    }
    
    geom( element  , index ){  

        let preProjected = [element.x , element.y]
        if(element["projection"])
            preProjected = element["projection"](element.x , element.y)
            
        let projected = this.drawingArea.projection(preProjected[0] , preProjected[1] )
        return {    id: element.id? element.id : index,
                    x : projected[0] ,
                    y : projected[1] ,
                    data: element.data,
                    attributes : element.attributes,
                    classes: this.getEntityClasses(element.classes,"scatter-point")
                    }
    }
    
}
