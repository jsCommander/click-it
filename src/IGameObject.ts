export interface IPosition {
  x: number;
  y: number;
}

export interface IGameObject {
  id: number;
  pos: IPosition;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D, deltaTime: number): void;
}
