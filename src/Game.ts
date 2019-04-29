import config from "./config.json";
import { IPosition } from "./IGameObject";
import { Target } from "./Target";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private targets: { [id: number]: Target } = {};
  private mousePosition?: IPosition;
  private timer: number = 0;
  private spawnTimer: number = config.spawnDelayMax;
  private spawnDelay: number = config.spawnDelayMax;
  private targetLiveTime: number = config.liveTimeMax;
  private lastId: number = 0;
  private level: number = 1;
  private hit: number = 0;
  private miss: number = 0;
  private font: string = `18px ${config.font}`
  private topOffset: number = 80;

  constructor(container: HTMLElement) {
    if (!container) {
      throw new Error("Please provide correct container element");
    }

    const canvas = document.createElement("canvas");
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

    this.resize(container);

    window.addEventListener("resize", () => {
      this.resize(container);
    })

    container.appendChild(canvas);
  }

  public resize(container: HTMLElement) {
    const bound = container.getBoundingClientRect();
    this.ctx.canvas.width = Math.round(bound.width);
    this.ctx.canvas.height = Math.round(bound.height);
  }

  public update(deltaTime: number) {
    // update timers
    this.timer += deltaTime;
    this.spawnTimer += deltaTime;
    // check level time
    if (this.timer > config.levelTime * this.level) {
      this.level += 1;
      const newLiveTime = this.targetLiveTime - config.liveTimeStep;
      this.targetLiveTime = Math.max(newLiveTime, config.liveTimeMin);
      const newSpawnDeley = this.spawnDelay - config.spawnDelayStep;
      this.spawnDelay = Math.max(newSpawnDeley, config.spawnDelayMin);
    }

    // update gameobjects
    for (const key in this.targets) {
      if (this.targets.hasOwnProperty(key)) {
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
            this.hit += 1;
            delete this.targets[key];
          }
        }

        if (target.isDead) {
          this.miss += 1;
          delete this.targets[key];
        }
      }
    }

    // spawn new gameobjects
    if (this.targetsCount() < config.targetMax) {
      if (this.spawnTimer > this.spawnDelay || this.targetsCount() < 1) {
        this.lastId += 1;
        this.targets[this.lastId] = new Target(
          this.lastId,
          this.getRandomPosition(),
          this.targetLiveTime
        );
        this.spawnTimer = 0;
      }
    }
    // reset user input
    this.mousePosition = undefined;
  }

  public render(deltaTime: number) {
    // clean canvas and fit it size to container
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    for (const key in this.targets) {
      if (this.targets.hasOwnProperty(key)) {
        const target = this.targets[key];
        target.render(this.ctx, deltaTime);
      }
      this.ctx.lineWidth = 1;
      this.ctx.font = this.font;
      this.ctx.fillStyle = "white";
      this.ctx.textAlign="center"
      this.ctx.fillText(
        `Level: ${this.level}, Hit: ${this.hit}, Miss: ${this.miss}`,
        Math.round(this.ctx.canvas.width / 2),
        20
      );

      this.ctx.fillText(
        `TargetLiveTime: ${this.targetLiveTime}, TargetSpawnDelay: ${
        this.spawnDelay
        }`,
        Math.round(this.ctx.canvas.width / 2),
        40
      );
    }
  }

  public targetsCount(): number {
    return Object.keys(this.targets).length;
  }

  public getRandomPosition(): IPosition {
    const radius = config.target.radiusMax;
    const x = Math.floor(Math.random() * this.ctx.canvas.width);
    const y = Math.floor(Math.random() * this.ctx.canvas.height);

    return {
      x: this.restrictPosition(x, radius, this.ctx.canvas.width - radius),
      y: this.restrictPosition(y + this.topOffset, radius, this.ctx.canvas.height - radius)
    };
  }
  public restrictPosition(num: number, min: number, max: number): number {
    num = Math.max(min, num);
    num = Math.min(max, num);
    return num;
  }
}
