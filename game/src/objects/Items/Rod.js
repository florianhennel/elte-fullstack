import { Vector2 } from "../../engine/types/Vectors.js";
import { resources } from "../../engine/Resources/Resource.js";
import { PickUpItem } from "./PickUpItem.js";

export class Rod extends PickUpItem {
  constructor(x, y) {
    super({
      position: new Vector2(x, y)
    }, resources.images.rod);
  }
}