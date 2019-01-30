import { IGameObject, Position } from "./IGameObject";

export class Target implements IGameObject {
  private curRadius: number = 20;
  //private maxRadius: number = 50;
  //private shrinkSpeed: number = 100;
  public liveTime: number = 0;
  constructor(public id, public position: Position) {}
  update(deltaTime: number) {
    this.liveTime += deltaTime;
  }
  render(context: CanvasRenderingContext2D, deltaTime: number) {
    context.beginPath();
    context.shadowColor = "gray";
    context.shadowBlur = 15;
    context.fillStyle = "white";
    context.arc(
      this.position.x,
      this.position.y,
      this.curRadius,
      0,
      2 * Math.PI,
      false
    );
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.stroke();
  }
  isPointInTargetBorder(point: Position) {
    const dx = Math.abs(this.position.x - point.x);
    const dy = Math.abs(this.position.y - point.y);
    if (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(this.curRadius, 2)) {
      console.log(
        "TCL: Target -> isPointInTargetBorder -> position",
        this.position
      );
      console.log("TCL: Target -> isPointInTargetBorder -> point", point);
      console.log("TCL: Target -> isPointInTargetBorder -> dx", dx);
      console.log("TCL: Target -> isPointInTargetBorder -> dy", dy);
      console.log(
        "TCL: Target -> isPointInTargetBorder -> curRadius",
        this.curRadius
      );
      return true;
    } else {
      return false;
    }
  }
}
