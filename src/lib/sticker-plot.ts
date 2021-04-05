/*import { Plottable, drawShapes } from "./core";
import { Subject } from "rxjs";

import * as d3 from "d3";



export class StickerPlot extends Plottable {
    
    selectionSubject   = new Subject<any>()
    entities : Array<any> = undefined 
    entities$ = new Subject<any>()
    entitiesInput$ = undefined

    selector
    scaleId = undefined

    defaultElementDisplay = (d) => 
        `<circle height='100' width='50' class='circle' cx="0" cy="0" , r="10" >
        </circle>
       `


    constructor(  public readonly plotData ){
        super(plotData.plotId,plotData.plotClasses,plotData.drawingArea,
            plotData.orderIndex? plotData.orderIndex : 0)   
        
        this.entities = plotData.entities as Array<any>
        this.entities = [] 
        if(plotData.entities)      
            this.entities = plotData.entities as Array<any>
        else {
            this.entitiesInput$ = plotData.entities$
            this.entitiesInput$.subscribe( entities => {
                this.entities = entities
                this._draw(this.entities)
            })
        }
    }

    draw()  {     
        
        let plotGroup = this.getOrAppendLayer("stickers")      
        let layout    = this.drawingArea.layout        
        let allGeoms     = this.entities
        .map( (e,i) => this.geom( e, i ) )
                
        let geoms = allGeoms
        .filter( geom => geom)
        .filter( geom => geom.x >= layout.marginLeft - this.drawingArea.overflowDisplay.left &&
            geom.x <= layout.marginLeft + layout.hAxisLength + this.drawingArea.overflowDisplay.right && 
            geom.y >= layout.marginTop - this.drawingArea.overflowDisplay.top &&
            geom.y <= layout.marginTop + layout.vAxisLength + this.drawingArea.overflowDisplay.bottom )

        let gs = drawShapes( plotGroup, geoms , this.defaultElementDisplay  )
        this.plugActions(gs.entered, this.entities$) 
        
    }
    //plug output ButtonModule_a07fafb9-aae1-ead4-5c70-642d104dedfa
    geom( entity,  index  ){

        let element = document.querySelector(entity.selector)
        if(!element)
            return undefined
        let p = element
        let parents = []
        while( p != undefined && ! p.parentNode.classList.contains("root-drawing-area-group")){
            p = p.parentNode
            if(p.nodeName=="g")
                parents.push(p) 
        }

        let coors= parents.map( p=> { 
            let transform = d3.select(p).attr("transform")
            if(!transform)
                return [0,0]
            let coors= transform.replace(/[^0-9\-.,]/g, '').split(',') 
            return coors.length > 1 ? [Number(coors[0]), Number(coors[1]) ] :  [0,0]  
        }).reduce( (acc,e )=> [acc[0]+e[0], acc[1]+e[1]], [0,0])
        
        let geom = {id: entity.id? entity.id : index,
            x:coors[0] + Number(entity.x(element)), 
            y:coors[1] + Number(entity.y(element)), 
            classes: this.getEntityClasses(entity.classes,"sticker"),
            data :  entity.data } 
        return geom
    }   
    
}

*/