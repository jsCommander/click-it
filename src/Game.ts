import { Position } from "./IGameObject";
import { Target } from "./Target";
import config from "./config.json";

export class Game {
  private canvas: HTMLCanvasElement;
  private textLine1: HTMLElement;
  private textLine2: HTMLElement;
  private ctx: CanvasRenderingContext2D;
  private targets: { [id: number]: Target } = {};
  private mousePosition?: Position;
  private timer: number = 0;
  private spawnTimer: number = config.spawnDelayMax;
  private spawnDelay: number = config.spawnDelayMax;
  private targetLiveTime: number = config.liveTimeMax;
  private lastId: number = 0;
  private level: number = 1;
  private hit: number = 0;
  private miss: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error("Please provide correct canvas element");
    }

    this.canvas = canvas;
    this.canvas.width = config.canvas.width;
    this.canvas.height = config.canvas.height;
    this.canvas.style.background = config.canvas.background;
    this.textLine1 = document.querySelector(".info__text.line-1");
    this.textLine2 = document.querySelector(".info__text.line-2");

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

  render(deltaTime: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const key in this.targets) {
      const target = this.targets[key];
      target.render(this.ctx, deltaTime);
    }
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeStyle = "white";
    // this.ctx.strokeText(
    //   `Level: ${this.level}, Hit: ${this.hit}, Miss: ${this.miss}`,
    //   20,
    //   20
    // );
    this.textLine1.innerHTML = "Level: <i>"+this.level+"</i>, Hit: <i>"+this.hit+"</i>, Miss: <i>"+this.miss+"</i>";
    this.textLine2.innerHTML = "TargetLiveTime: <i>"+this.targetLiveTime+"</i>, TargetSpawnDelay: <i>"+this.spawnDelay+"</i>";
    // this.ctx.strokeText(
    //   `TargetLiveTime: ${this.targetLiveTime}, TargetSpawnDelay: ${
    //     this.spawnDelay
    //   }`,
    //   20,
    //   40
    // );
  }

  targetsCount(): number {
    return Object.keys(this.targets).length;
  }

  getRandomPosition(): Position {
    const radius = config.target.radiusMax;
    const x = Math.floor(Math.random() * this.canvas.width);
    const y = Math.floor(Math.random() * this.canvas.height);

    return {
      x: this.restrictPosition(x, radius, this.canvas.width - radius),
      y: this.restrictPosition(y, radius, this.canvas.height - radius)
    };
  }
  restrictPosition(num: number, min: number, max: number): number {
    num = Math.max(min, num);
    num = Math.min(max, num);
    return num;
  }
}
