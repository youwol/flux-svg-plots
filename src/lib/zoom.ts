


import {event as d3Event} from "d3-selection";

interface Zoom{

    apply( drawingArea, event )
}

export class ZoomTranslatePolicy implements Zoom { 

    constructor(public readonly group){}

    apply( d , event =undefined){
        event = event ? event : d3Event  
        let {x,y,k} = event.transform
        this.group.attr("transform", `translate(${x},${y}) scale(${k})`)
        d.setOverallTransform({translateX:x,translateY:y,scale:k})
        d.previousPos = event.transform.x
        d.previousZoom =  event.transform.k
    }    
}

