import { Plottable, drawShapes } from "./core";
import { Subject } from "rxjs";

export class LinkPlot extends Plottable {
    
    selectionSubject   = new Subject<any>()
    entities : Array<any> = undefined 
    entities$ = new Subject<any>()
    entitiesInput$ = undefined

    selector
    scaleId = undefined

    constructor(  public readonly plotData ){
        super(plotData.plotId,plotData.plotClasses,plotData.drawingArea)   
    }

    draw(connectionsPlotData : Array<any>)  {        
                
        let plotGroup = this.getPlotGroup(this.plotClasses)        
        let layout    = this.drawingArea.layout  

        let geoms     = connectionsPlotData
        .map( (e,i) => this.geom( e, i ) )
        .filter( geom => geom)
        
        let gs = drawShapes( plotGroup, geoms , this.defaultElementDisplay  )
        
        this.plugActions(gs.entered, this.entities$)
        return gs
    }
    
    geom( entity,  index  ){

        let inputSelector = "#input-slot_"+entity.data.end.slotId+"_"+entity.data.end.moduleId
        let outputSelector = "#output-slot_"+entity.data.start.slotId+"_"+entity.data.start.moduleId
        if(!entity.inputGroup || !entity.outputGroup )
            return undefined
        let element1 = entity.inputGroup.querySelector(inputSelector)
        let element2 = entity.outputGroup.querySelector(outputSelector)
        if(!element1 || !element2 )
            return undefined
        let x1       = Number(entity.inputGroup.getAttribute("x")) + Number(element1.getAttribute("cx"))
        let x2       = Number(entity.outputGroup.getAttribute("x")) + Number(element2.getAttribute("cx"))
        let y1       = Number(entity.inputGroup.getAttribute("y")) + Number(element1.getAttribute("cy"))
        let y2       = Number(entity.outputGroup.getAttribute("y")) + Number(element2.getAttribute("cy"))
        let sinTheta = (y2-y1)/Math.pow(((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)),0.5)
        let cosTheta = (x2-x1)/Math.pow(((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)),0.5)
        let middleX = 0.5*(x1+x2)
        let middleY = 0.5*(y1+y2)
        return {id: entity.id,
                x1:x1-middleX + 5*cosTheta, 
                y1:y1-middleY + 5*sinTheta, 
                x2:x2-middleX - 5*cosTheta, 
                y2:y2-middleY - 5*sinTheta, 
                x:middleX,
                y:middleY,
                classes: this.getEntityClasses(entity.classes,"sticker"),
                data :  entity.data } 
    }   
    
    defaultElementDisplay = (d) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
        g.innerHTML = `<line class='' x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}"></line>`
        return g
        /*
        let norm = Math.pow( (d.x2-d.x1)*(d.x2-d.x1) + (d.y2-d.y1)*(d.y2-d.y1) , 0.5)
        let cos_a =  (d.x1-d.x2)/ norm
        let sin_a =  (d.y1-d.y2)/ norm
        let angle = Math.acos( (d.x1-d.x2)/ norm ) * 180 /3.14
        if(d.y2>d.y1){
            angle = -angle
        }
        return `
        <line class='' x1="${d.x1- 50* cos_a}" y1="${d.y1- 50* sin_a}" x2="${d.x2}" y2="${d.y2}"></line>
        <g transform="translate(${-(d.x2-d.x1)/2 - 50* cos_a },${-(d.y2-d.y1)/2  - 50* sin_a } ) rotate(${angle+45})  translate(-0,-36) scale(0.1)">
	        <path d="M211.331,190.817c-1.885-1.885-4.396-2.922-7.071-2.922c-2.675,0-5.186,1.038-7.07,2.922l-32.129,32.129l-24.403-24.403   l32.129-32.129c3.897-3.899,3.897-10.243-0.001-14.142l-11.125-11.125c-1.885-1.885-4.396-2.922-7.071-2.922   c-2.675,0-5.187,1.038-7.07,2.923l-32.128,32.128l-18.256-18.256c-1.885-1.885-4.396-2.922-7.071-2.922   c-2.675,0-5.186,1.038-7.07,2.922L66.95,171.062c-3.899,3.899-3.899,10.243,0,14.143l3.802,3.802   c-1.596,1.086-3.103,2.325-4.496,3.718l-46.679,46.679c-5.836,5.835-9.049,13.62-9.049,21.92c0,8.301,3.214,16.086,9.049,21.92   l17.943,17.943L5.126,333.582c-6.835,6.835-6.835,17.915,0,24.749c3.417,3.417,7.896,5.125,12.374,5.125s8.957-1.708,12.374-5.125   l32.395-32.395l18.091,18.091c5.834,5.835,13.619,9.048,21.92,9.048s16.086-3.213,21.92-9.048l46.679-46.679   c1.394-1.393,2.633-2.901,3.719-4.497l3.802,3.802c1.885,1.885,4.396,2.923,7.07,2.923c2.675,0,5.186-1.038,7.072-2.923   l16.04-16.042c1.887-1.885,2.925-4.396,2.925-7.072c0-2.676-1.038-5.187-2.924-7.071l-18.255-18.255l32.129-32.129   c3.898-3.899,3.898-10.244-0.001-14.142L211.331,190.817z"/>
	        <path d="M358.33,5.126c-6.834-6.834-17.914-6.834-24.748,0l-32.686,32.686l-17.944-17.944c-5.834-5.835-13.619-9.048-21.92-9.048   c-8.301,0-16.086,3.213-21.92,9.048l-46.679,46.679c-1.393,1.393-2.632,2.9-3.719,4.497l-3.802-3.802   c-1.885-1.885-4.396-2.923-7.071-2.923c-2.675,0-5.187,1.038-7.071,2.923l-16.042,16.042c-1.886,1.885-2.924,4.396-2.924,7.072   c0,2.675,1.038,5.187,2.924,7.071l111.447,111.448c1.885,1.885,4.396,2.923,7.071,2.923c2.676,0,5.186-1.038,7.071-2.923   l16.043-16.043c3.899-3.899,3.899-10.243,0-14.142l-3.801-3.801c1.596-1.086,3.103-2.325,4.496-3.719l46.679-46.679   c5.835-5.834,9.049-13.62,9.049-21.92s-3.213-16.086-9.049-21.92l-18.09-18.09l32.686-32.686   C365.165,23.04,365.165,11.96,358.33,5.126z"/>
        </g>
       `*/
    }
}


