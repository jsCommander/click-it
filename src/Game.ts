import { Position } from "./IGameObject";
import { Target } from "./Target";
import config from "./config.json";

export class Game {
  private context: CanvasRenderingContext2D;
  private targets: Target[] = [];
  private mousePosition?: Position;
  private spawnTimer: number = 0;
  //private score: number = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Cant create canvas 2d context");
    }
    this.context = context;
    canvas.addEventListener("click", event => {
      this.mousePosition = {
        x: event.offsetX,
        y: event.offsetY
      };
    });
  }
  update(deltaTime: number) {
    this.targets = this.targets.filter(target => {
      target.update(deltaTime);
      console.log("TCL: Game -> update -> mousePosition", this.mousePosition);
      if (
        this.mousePosition &&
        target.isPointInTargetBorder(this.mousePosition)
      ) {
        return false;
      }

      if (target.liveTime < 20000) {
        return target;
      } else {
        console.log("Game: delete target");
      }
    });

    this.mousePosition = undefined;

    if (this.spawnTimer > config.spawnDelayMax) {
      if (this.targetCount() < config.targetMax) {
        const pos = this.getRandomPosition();
        console.log("TCL: Game -> update -> pos", pos);
        console.log(this.canvas.width);
        this.targets.push(new Target(pos));
        this.spawnTimer = 0;
      }
    } else {
      this.spawnTimer += deltaTime;
    }
  }
  render(deltaTime: number) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.targets.forEach(target => target.render(this.context, deltaTime));
  }
  targetCount() {
    return this.targets.length;
  }
  getRandomPosition(): Position {
    const pos = {
      x: Math.floor(Math.random() * this.canvas.width),
      y: Math.floor(Math.random() * this.canvas.height)
    };

    return pos;
  }
}
