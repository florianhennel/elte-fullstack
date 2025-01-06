import { Room } from "./Room"
import { gridSize } from "../../engine/config/config.json"
import { Rod } from "../Items/Rod"
import { gridCells } from "../../helpers/grid"
import { RandomItem } from "../Items/RandomItem"

export class Market extends Room {
  constructor({ position, size, itemGenerator }) {
    super({ position, size })

    //add pickup items
    const sizeInCoords = size.mul(1 / gridSize)

    const itemPlaces = getItemPlaces(...sizeInCoords)
    itemPlaces.forEach(([x, y]) => {
      const rod = new RandomItem(gridCells(x), gridCells(y), itemGenerator)
      this.addChild(rod);
    })

  }
}

/**
 * 
 * @param {Number} width 
 * @param {Number} height 
 * @returns {[[Number]]}
 */
function getItemPlaces(width, height) {
  if (width < height)
    return getItemPlaces(height, width)
      .map(([y, x]) => [x, y])

  // Middle position in y
  const middleY = Math.ceil(height / 2);

  // Middle 3 positions in x with 1 spacing
  const middleX = Math.ceil(width / 2);
  const gap = Math.ceil((width - 5) / 4)
  const middle3X = [middleX - gap, middleX, middleX + gap];

  return middle3X.map(e => [e, middleY])
}