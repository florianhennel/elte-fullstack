import { GameObject } from "../../engine/GameObject.js";
import { Vector2 } from "../../engine/types/Vectors.js";
import { DOWN, LEFT, RIGHT, UP } from "../../engine/Input.js";
import { gridCells, isSpaceFree } from "../../helpers/grid.js";
import { Sprite } from "../../engine/Sprite.js";
import { resources } from "../../engine/Resources/Resource.js";
import { Animations } from "../../engine/Animations.js";
import { FrameIndexPattern } from "../../engine/FrameIndexPattern.js";
import {
  PICK_UP_DOWN,
  STAND_DOWN,
  STAND_LEFT,
  STAND_RIGHT,
  STAND_UP,
  WALK_DOWN,
  WALK_LEFT,
  WALK_RIGHT,
  WALK_UP
} from "./heroAnimations.js";
import { moveTowards } from "../../helpers/moveTowards.js";
import { events } from "../../engine/Events/Events.js";
import { gridSize, heroSpeed } from "../../engine/config/config.json"
import { fps } from "../../engine/config/config.json"

export class Hero extends GameObject {
  constructor(x, y) {
    super({
      position: new Vector2(x, y)
    });

    const shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8, -19),
    })
    this.addChild(shadow);

    this.body = new Sprite({
      resource: resources.images.hero,
      frameSize: new Vector2(32, 32),
      hFrames: 3,
      vFrames: 8,
      frame: 1,
      position: new Vector2(-8, -20),
      animations: new Animations({
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkUp: new FrameIndexPattern(WALK_UP),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkRight: new FrameIndexPattern(WALK_RIGHT),
        standDown: new FrameIndexPattern(STAND_DOWN),
        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standRight: new FrameIndexPattern(STAND_RIGHT),
        pickUpDown: new FrameIndexPattern(PICK_UP_DOWN),
      })
    })
    this.addChild(this.body);

    this.facingDirection = DOWN;
    this.destinationPosition = this.position.duplicate();
    this.itemPickupTime = 0;
    this.itemPickupShell = null;
    this.isLocked = false;

    // React to picking up an item
    events.on("HERO_PICKS_UP_ITEM", this, data => {
      this.onPickUpItem(data)
    })

    this.drawLayer = "HERO"
  }

  ready() {
    events.on("START_TEXT_BOX", this, () => {
      this.isLocked = true;
    })
    events.on("END_TEXT_BOX", this, () => {
      this.isLocked = false;
    })
    events.on("HERO_ENTER_ROOM", this, r => console.log(r))
  }

  step(delta, root) {
    delta = Math.min(delta, 1000 / fps)
    // Don't do anything when locked
    if (this.isLocked) {
      return;
    }

    // Lock movement if celebrating an item pickup
    if (this.itemPickupTime > 0) {
      this.workOnItemPickup(delta);
      return;
    }

    // Check for input
    /** @type {Input} */
    const input = root.input;
    if (input?.getActionJustPressed("Space")) {
      // Look for an object at the next space (according to where Hero is facing)
      const objAtPosition = this.parent.children.find(child => {
        return child.position.isEqual(this.position.toNeighbor(this.facingDirection))
      })
      if (objAtPosition) {
        events.emit("HERO_REQUESTS_ACTION", objAtPosition);
      }
    }

    const distance = moveTowards(this, this.destinationPosition, heroSpeed);
    const hasArrived = distance <= 1;
    // Attempt to move again if the hero is at his position
    if (hasArrived) {
      this.tryMove(root)
    }

    this.tryEmitPosition()
  }

  tryEmitPosition() {
    if (this.lastX === this.position.x && this.lastY === this.position.y) {
      return;
    }
    this.lastX = this.position.x;
    this.lastY = this.position.y;
    events.emit("HERO_POSITION", this.position)
  }

  tryMove(root) {
    const { input } = root;

    if (!input.direction) {

      if (this.facingDirection === LEFT) { this.body.animations.play("standLeft") }
      if (this.facingDirection === RIGHT) { this.body.animations.play("standRight") }
      if (this.facingDirection === UP) { this.body.animations.play("standUp") }
      if (this.facingDirection === DOWN) { this.body.animations.play("standDown") }

      return;
    }

    let nextX = this.destinationPosition.x;
    let nextY = this.destinationPosition.y;

    if (input.direction === DOWN) {
      nextY += gridSize;
      this.body.animations.play("walkDown");
    }
    if (input.direction === UP) {
      nextY -= gridSize;
      this.body.animations.play("walkUp");
    }
    if (input.direction === LEFT) {
      nextX -= gridSize;
      this.body.animations.play("walkLeft");
    }
    if (input.direction === RIGHT) {
      nextX += gridSize;
      this.body.animations.play("walkRight");
    }
    this.facingDirection = input.direction ?? this.facingDirection;

    // Validating that the next destination is free
    const spaceIsFree = isSpaceFree(root.level?.walls, nextX, nextY);
    const solidBodyAtSpace = this.parent.children.find(c => {
      return c.isSolid && c.position.x === nextX && c.position.y === nextY
    })
    if (spaceIsFree && !solidBodyAtSpace) {
      this.destinationPosition.x = nextX;
      this.destinationPosition.y = nextY;
    }
  }

  onPickUpItem({ image, position }) {
    // Make sure we land right on the item
    this.destinationPosition = position.duplicate();

    // Start the pickup animation
    this.itemPickupTime = 500; // ms

    this.itemPickupShell = new GameObject({});
    this.itemPickupShell.addChild(new Sprite({
      resource: image,
      position: new Vector2(0, -18)
    }))
    this.addChild(this.itemPickupShell);
  }

  workOnItemPickup(delta) {
    this.itemPickupTime -= delta;
    this.body.animations.play("pickUpDown")

    // Remove the item being held overhead
    if (this.itemPickupTime <= 0) {
      this.itemPickupShell.destroy();
    }

  }


}


let tttt = 0