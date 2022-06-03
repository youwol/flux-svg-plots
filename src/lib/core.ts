import { DrawingArea } from "./drawing-area";
import { select, pointer } from "d3-selection";
import { drag as d3Drag } from "d3-drag";

export function toCssName(name: string) {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/\./g, "-")
    .replace(/~/g, "-")
    .replace(/:/g, "-")
    .replace(/\//g, "_")
    .replace(/{/g, "")
    .replace(/}/g, "")
    .replace(/@/g, "-");
}

export function drawShapes(svgGroup, geoms, svgElements) {
  let selection = select(svgGroup.node())
    .selectAll("g.entity")
    .data(geoms, (d) => d.id);
  selection.exit().remove();

  let updateGroups = selection
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("class", (d) => d.classes.join(" "));

  updateGroups.selectAll("*").remove();
  updateGroups.each(function (d) {
    // node is the group element we want to populate
    let node = select(this).node();
    // elem is the group element we want to switch with
    let elem = svgElements(d);
    let c = elem.firstChild;
    [...elem.attributes]
      .filter((attr) => attr.nodeName != "id")
      .forEach((attr) => node.setAttribute(attr.nodeName, attr.nodeValue));
    while (c) {
      node.appendChild(c);
      c = elem.firstChild;
    }
  });
  updateGroups.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
  //updateGroups.transition().duration(500).attr("transform", (d)=>"translate("+d.x+","+d.y+")")

  let newGroups = selection
    .enter()
    .append((d) => svgElements(d))
    .attr("class", (d) => d.classes.join(" "))
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("id", (d) => d.id);

  selection.exit().remove();
  return { entered: newGroups, updated: updateGroups };
}

// This is to avoid import of d3 in other places (in case of refactoring it can help)

export class Plottable {
  plotGroup = undefined;
  cachedLayer = undefined;

  constructor(
    public readonly plotId: string,
    public readonly plotClasses: Array<string>,
    public drawingArea: DrawingArea
  ) {}

  getPlotGroup(classes) {
    if (!this.plotGroup)
      this.plotGroup = this.drawingArea.getPlotGroup(this.plotId, classes);
    return this.plotGroup;
  }

  getEntityClasses(elementClasses, entityType) {
    let cs = elementClasses.concat(["entity", entityType]);
    return cs.filter((e, i, self) => self.indexOf(e) == i);
  }

  formatAction(actionName, that, d, thisSvg, mouse, event) {
    return {
      action: actionName,
      d3Selection: thisSvg,
      data: d,
      serie: that,
      mouse: mouse,
      event: event,
    };
  }

  plugActions(groups, entities$) {
    let that = this;

    const drag = d3Drag();
    [
      "click",
      "dblclick",
      "mousedown",
      "mouseover",
      "mouseout",
      "mouseup",
    ].forEach((action) =>
      groups.on(action, function (event, d) {
        entities$.next(
          that.formatAction(action, that, d, select(this), pointer, event)
        );
      })
    );
    ["start", "drag", "end"].forEach((action) =>
      drag.on(action, function (event, d) {
        entities$.next(
          that.formatAction(action, that, d, select(this), pointer, event)
        );
      })
    );
    groups.call(drag);
  }
}
