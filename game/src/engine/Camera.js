import { GameObject } from "./GameObject.js";
import { events } from "./Events/Events.js";
import { Vector2 } from "./types/Vectors.js";
import config from "./config/config.json"

export class Camera extends GameObject {
  constructor() {
    super({});

    events.on("HERO_POSITION", this, heroPosition => {
      this.centerPositionOnTarget(heroPosition)
    })

    // Camera knows when a new level starts
    events.on("CHANGE_LEVEL", this, (newMap) => {
      this.centerPositionOnTarget(newMap.heroStartPosition)
    })
  }

  centerPositionOnTarget(pos) {
    // Create a new position based on the incoming position
    const personHalf = config.gridSize / 2;
    const canvasWidth = config.canvasSize[0];
    const canvasHeight = config.canvasSize[1];
    const halfWidth = -personHalf + canvasWidth / 2;
    const halfHeight = -personHalf + canvasHeight / 2;
    this.position = new Vector2(
      -pos.x + halfWidth,
      -pos.y + halfHeight,
    )
  }


}