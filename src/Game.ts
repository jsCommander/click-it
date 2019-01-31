import { Position } from "./IGameObject";
import { Target } from "./Target";
import config from "./config.json";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private targets: { [id: number]: Target } = {};
  private mousePosition?: Position;
  private spawnTimer: number = 0;
  private lastId: number = 0;
  public score: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error("Please provide correct canvas element");
    }

    this.canvas = canvas;
    this.canvas.width = config.canvas.width;
    this.canvas.height = config.canvas.height;
    this.canvas.style.background = config.canvas.background;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Can't create canvas 2d context");
    }
    this.ctx = ctx;
    canvas.addEventListener("click", event => {
      this.mousePosition = {
        x: event.offsetX,
        y: event.offsetY
      };
    });
  }

  update(deltaTime: number) {
    // update gameobjects
    for (const key in this.targets) {
      const target = this.targets[key];
      target.update(deltaTime);

      // Check colision
      if (this.mousePosition) {
        const isHit = this.ctx.isPointInPath(
          target.path,
          this.mousePosition.x,
          this.mousePosition.y
        );

        if (isHit) {
          this.score += 1;
          delete this.targets[key];
        }
      }

      if (target.isDead) {
        this.score -= 1;
        delete this.targets[key];
      }
    }

    // spawn new gameobjects
    if (this.spawnTimer > config.spawnDelayMax) {
      if (this.targetsCount() < config.targetMax) {
        this.lastId += 1;
        this.targets[this.lastId] = new Target(
          this.lastId,
          this.getRandomPosition(),
          5000
        );
        this.spawnTimer = 0;
      }
    } else {
      this.spawnTimer += deltaTime;
    }
    // reset user input
    this.mousePosition = undefined;
  }

  render(deltaTime: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const key in this.targets) {
      const target = this.targets[key];
      target.render(this.ctx, deltaTime);
    }

    this.ctx.strokeText(`Score: ${this.score}`, 150, 20);
  }

  targetsCount(): number {
    return Object.keys(this.targets).length;
  }

  getRandomPosition(): Position {
    const pos = {
      x: Math.floor(Math.random() * this.canvas.width),
      y: Math.floor(Math.random() * this.canvas.height)
    };

    return pos;
  }
}
