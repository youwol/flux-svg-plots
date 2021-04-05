
import { ZoomTranslatePolicy } from './zoom';
import {selectAll, select} from "d3-selection";
import {zoom, zoomIdentity} from "d3-zoom";
import {scaleLinear} from "d3-scale"

export class DrawingArea{
    
    shapes = []
    plots  = new Map()

    groupShapes = undefined

    overallTranform = {
        translateX: 0,
        translateY: 0,
        scale:1
    }
    overflowDisplay = {
        left:0,
        right:0,
        top:0,
        bottom:0
    }

    zoomPolicy : ZoomTranslatePolicy
    zoom: any

    constructor( 
        public readonly parentDiv,
        public readonly svgCanvas : any, 
        public readonly drawingGroup: any,
        public readonly hScale: any,
        public readonly vScale: any,
        public readonly layout
    ){   
        this.drawingGroup = this.svgCanvas.select("#drawing-group")
        if(this.drawingGroup.empty()){
            this.drawingGroup = this.svgCanvas
            .append("g")
            .attr("id" ,"drawing-group" )
            .attr("class" , "root-group")
        }
        
        this.zoomPolicy = new ZoomTranslatePolicy(this.drawingGroup)
            
        let that = this
        this.zoom = zoom().on("zoom", () => {
            this.zoomPolicy.apply(that)
         });
        svgCanvas.call(this.zoom) 
    };
   
    lookAt(x : number,y : number){

        x = this.overallTranform.translateX + 0.5 * Number(this.svgCanvas.node().clientWidth)  - x
        y = this.overallTranform.translateY + 0.5 * Number(this.svgCanvas.node().clientHeight) - y
        let scale = this.overallTranform.scale
        this.drawingGroup.attr("transform",`translate(${x},${y}) scale(${scale})`)
        zoom().transform(this.svgCanvas, zoomIdentity.translate(x,y).scale(scale));
        this.setOverallTransform({translateX:x,translateY:y,scale:scale})
        
    }

    getPlotGroup(plotId,classes){
        let plotGroup = this.drawingGroup.select("#"+plotId)
        if(plotGroup.empty()){
            plotGroup = this.drawingGroup
            .append("g")
            .attr("id" ,plotId )
            .attr("class" , "plot-group "+ classes.join(" ") )
        }
        return plotGroup
    }
    setOverallTransform({translateX,translateY,scale}){
        this.overallTranform = {translateX:translateX, translateY:translateY, scale:scale} 
    }

    projection(x,y){        
        return [ this.hScale(x),this.vScale(y) ]
    }

    invert(x,y) : [number,number] {
        let scale = this.overallTranform["scale"]
        let x0 = (x - this.overallTranform.translateX)/scale
        let y0 = (y - 50 - this.overallTranform.translateY)/scale
        return [ this.hScale.invert(x0) , this.vScale.invert(y0)  ]
    }

    selectAll(selector) {
        return selectAll(selector)
    }
};

declare var $;

export function createDrawingArea(data ) {

    let parentDivId = data.containerDivId
    
    //$( "#"+parentDivId ).replaceWith( "<div id='"+ parentDivId+"' ></div>" );
    
    let parentDiv   =  document.getElementById(parentDivId)
    let height      = data.height? data.height : parentDiv.clientHeight;
    let width       = data.width ? data.width : parentDiv.clientWidth;

    let minX        = data.xmin ? data.xmin : -width/2
    let minY        = data.ymin ? data.ymin : -height/2
    let maxX        = data.xmax ? data.xmax : width/2
    let maxY        = data.ymax ? data.ymax : height/2


    let margin       = data.margin != undefined ? data.margin : 50
    let hAxisLength  = width - 2 * margin
    let vAxisLength  = height - 2 * margin
    let hScale = scaleLinear().range( [margin,margin + hAxisLength] ).domain( [minX,maxX] )  
    let vScale = scaleLinear().range( [margin,margin + vAxisLength] ).domain( [maxY,minY] )  

    let svgCanvas = select("#"+parentDivId)
        .selectAll("#"+parentDivId+"-drawing-area")
        .data([parentDivId+"-drawing-area" ] )
        .enter()
        .append("svg")
        .attr("id", parentDivId+"-drawing-area" )
        .attr("width", width )
        .attr("height", height )
        .attr("top", 0 )
        .attr("left", 0 )  

    let filter = svgCanvas.append("defs")
        .append("filter")
        .attr("id", "shadow")
        .attr("x", "-40%")
        .attr("y", "-20%")
        .attr("width", "200%")
        .attr("height", "200%")
    filter.append("feOffset")
        .attr("result", "offOut")
        .attr("in", "SourceAlpha")
        .attr("dx", "10")
        .attr("dy", "10")
    filter.append("feGaussianBlur")
        .attr("result", "blurOut")
        .attr("in", "offOut")
        .attr("stdDeviation", 10)
    filter.append("feBlend")
        .attr("in", "SourceGraphic")
        .attr("in2", "blurOut")
        .attr("mode", "normal");

    svgCanvas
        .append("rect")
        .attr("width","100%")
        .attr("height","100%")
        .attr("class","workspace-background")      
    let drawingGroup = svgCanvas.append("g")
        .attr("id", parentDivId+"-drawing-area-group" )
        .attr("class", "root-drawing-area-group" )


    let drawingArea = new DrawingArea(
        parentDiv, svgCanvas , drawingGroup,
        hScale, vScale,
        {marginTop : margin, marginLeft: margin, hAxisLength : hAxisLength , vAxisLength: vAxisLength })

    if( data.overflowDisplay)
        drawingArea.overflowDisplay = data.overflowDisplay
        
    return drawingArea
}

/*
export function resizeKeepMarginPolicy( entries  ){
    let drawingArea = this
    let newSize = entries[0].contentRect

    drawingArea.getSvgElement()
    .attr("width", newSize.width )
    .attr("height", newSize.height )
    .attr("top", 0 )
    .attr("left", 0 )

    drawingArea.layout.hAxisLength =  newSize.width   - 2 * drawingArea.layout.marginLeft
    drawingArea.layout.vAxisLength =  newSize.height  - 2 * drawingArea.layout.marginTop

    drawingArea.horizontalScaleDefault0.range( [drawingArea.layout.marginLeft,
        drawingArea.layout.marginLeft + drawingArea.layout.hAxisLength ])
    drawingArea.horizontalScaleDefault0.domain(drawingArea.horizontalScaleDefault.domain())
    drawingArea.verticalScaleDefault0.range( [drawingArea.layout.marginTop,                                              
        drawingArea.layout.marginTop + drawingArea.layout.vAxisLength ])
    drawingArea.verticalScaleDefault0.domain(drawingArea.verticalScaleDefault.domain())
    
    drawingArea.horizontalScaleDefault = drawingArea.horizontalScaleDefault0   
    drawingArea.verticalScaleDefault   = drawingArea.verticalScaleDefault0   
    //console.log(drawingArea.horizontalScaleDefault.domain())
    drawingArea.getSvgElement().call(d3.zoom().transform, d3.zoomIdentity.scale(1));                               
    drawingArea.draw()
}

export function resizeSimple( entries  ){
    let drawingArea = this
    let newSize = entries[0].contentRect

    drawingArea.getSvgElement()
    .attr("width", newSize.width )
    .attr("height", newSize.height )
    .attr("top", 0 )
    .attr("left", 0 )
}
*/            
