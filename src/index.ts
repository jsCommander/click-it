import { Game } from "./Game";

const cont = document.getElementById("game") as HTMLElement;

const game = new Game(cont);
let oldTimer = Date.now();

const gameCycle = ()=> {
  const nowTimer = Date.now();
  const delta = nowTimer - oldTimer;
  oldTimer = nowTimer;
  game.update(delta);
  game.render(delta);
  requestAnimationFrame(gameCycle);
}

requestAnimationFrame(gameCycle);

