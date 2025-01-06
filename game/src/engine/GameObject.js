import { Vector2 } from "./types/Vectors.js";
import { events } from "./Events/Events.js";

export class GameObject {
  constructor({ position }) {
    console.assert(position instanceof Vector2 || position === undefined)
    this.position = position ?? new Vector2(0, 0);
    this.children = [];
    this.parent = null;
    this.hasReadyBeenCalled = false;
    this.isSolid = false;
    this.drawLayer = null;
    this.zIndex = 0;
  }

  // First entry point of the loop
  stepEntry(delta, root) {
    // Call updates on all children first
    this.children.forEach((child) => child.stepEntry(delta, root));

    // Call ready on the first frame
    if (!this.hasReadyBeenCalled) {
      this.hasReadyBeenCalled = true;
      this.ready();
    }

    // Call any implemented Step code
    this.step(delta, root);
  }

  // Called before the first `step`
  ready() {
    // ...
  }

  // Called once every frame
  step(_delta) {
    // ...
  }

  /* draw entry */
  draw(ctx, x, y) {
    const drawPosX = x + this.position.x;
    const drawPosY = y + this.position.y;

    // Do the actual rendering for Images
    this.drawImage(ctx, drawPosX, drawPosY);

    // Pass on to children
    this.getDrawChildrenOrdered().forEach((child) => child.draw(ctx, drawPosX, drawPosY));
  }

  getDrawChildrenOrdered() {
    return [...this.children].sort((a, b) => {
      // if (a.zIndex !== 0 || b.zIndex !== 0)
      //   return b.zIndex - a.zIndex // descending

      if(a.drawLayer === "HERO"){
        return 1
      } else if (b.drawLayer === "HERO"){
        return -1
      }


      if (b.drawLayer === "FLOOR") {
        return 1;
      } 

      return a.position.y > b.position.y ? 1 : -1
    })
  }

  drawImage(ctx, drawPosX, drawPosY) {
    //...
  }

  // Remove from the tree
  destroy() {
    this.children.forEach(child => {
      child.destroy();
    })
    this.parent.removeChild(this)
  }

  /* Other Game Objects are nestable inside this one */
  addChild(gameObject) {
    gameObject.parent = this;
    this.children.push(gameObject);
  }

  removeChild(gameObject) {
    events.unsubscribe(gameObject);
    this.children = this.children.filter(g => {
      return gameObject !== g;
    })
  }

  getAbsolutePosition() {
    if (this.parent === null)
      return new Vector2(0, 0)
    return this.parent.getAbsolutePosition().add(this.position)
  }
}