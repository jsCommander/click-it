import { IGameObject, Position } from "./IGameObject";
import config from "./config.json";

export class Target implements IGameObject {
  public isDead: boolean = false;
  private radius: number;
  private shrinkSpeed: number;
  public path: Path2D;

  constructor(
    public id: number,
    public pos: Position,
    public liveTime: number
  ) {
    this.radius = config.target.radiusMax;
    this.path = this.drawPath(pos, this.radius);
    this.shrinkSpeed =
      (config.target.radiusMax - config.target.radiusMin) / liveTime;
  }
  update(deltaTime: number) {
    if (!this.isDead) {
      this.liveTime -= deltaTime;
      this.radius -= this.shrinkSpeed * deltaTime;
      this.path = this.drawPath(this.pos, this.radius);
      if (this.liveTime < 0) {
        this.setDead();
      }
    }
  }
  render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.fillStyle = config.target.fillStyle;
    ctx.strokeStyle = config.target.strokeStyle;
    ctx.lineWidth = config.target.lineWidth;

    ctx.fill(this.path);
    ctx.stroke(this.path);
  }

  private drawPath(pos: Position, radius: number): Path2D {
    const path = new Path2D();
    path.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
    return path;
  }

  private setDead() {
    this.isDead = true;
  }
}
