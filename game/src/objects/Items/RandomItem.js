import { Vector2 } from "../../engine/types/Vectors.js";
import { resources } from "../../engine/Resources/Resource.js";
import { PickUpItem } from "./PickUpItem.js";

export class RandomItem extends PickUpItem {
  constructor(x, y, itemGenerator) {
    super({
      position: new Vector2(x, y)
    }, resources.images.randomItem, itemGenerator.next().value);
  }
}