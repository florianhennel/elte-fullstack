import { GameObject } from "../../engine/GameObject.js";
import { Vector2 } from "../../engine/types/Vectors.js";

export class Level extends GameObject {
  constructor() {
    super({});
    this.background = null;
  }
}