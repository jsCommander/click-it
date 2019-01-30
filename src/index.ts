import { Game } from "./Game";

const canvas = document.getElementById("game") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Cant find canvas element");
}

const game = new Game(canvas);
let timer = Date.now();

setInterval(() => {
  const now = Date.now();
  const delta = now - timer;
  timer = now;
  game.update(delta);
  game.render(delta);
}, 35);
