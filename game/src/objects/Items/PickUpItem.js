import { GameObject } from "../../engine/GameObject.js";
import { Vector2 } from "../../engine/types/Vectors.js";
import { Sprite } from "../../engine/Sprite.js";
import { resources } from "../../engine/Resources/Resource.js";
import { events } from "../../engine/Events/Events.js";

export class PickUpItem extends GameObject {
  constructor(params, resource, data = undefined) {
    super(params);

    this.itemResource = resource
    this.itemData = data

    const sprite = new Sprite({
      resource: this.itemResource,
      position: new Vector2(0, -5) // nudge upwards visually
    })
    this.addChild(sprite);
  }

  ready() {
    events.on("HERO_POSITION", this, pos => {
      // detect overlap...
      const roundedHeroX = Math.round(pos.x);
      const roundedHeroY = Math.round(pos.y);
      if (roundedHeroX === this.getAbsolutePosition().x && roundedHeroY === this.getAbsolutePosition().y) {
        this.onCollideWithHero();
      }
    })
  }

  draw(ctx, x, y) {
    super.draw(ctx, x, y)
  }

  onCollideWithHero() {
    // Remove this instance from the scene
    this.destroy();

    // Alert other things that we picked up a rod
    events.emit("HERO_PICKS_UP_ITEM", {
      data: this.itemData,
      image: this.itemResource,
      position: this.getAbsolutePosition()
    })
  }

}