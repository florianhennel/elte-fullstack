import { Room } from "./Room"
import { gridSize } from "../../engine/config/config.json"
import { gridCells } from "../../helpers/grid"
import { Exit } from "../Exit/Exit"

export class Boss extends Room {
  constructor({ position, size }) {
    super({ position, size })

    // add exit
    const sizeInCoords = size.mul(1 / gridSize)

    const exitPlace = getMiddlePosition(...sizeInCoords)
    const exit = new Exit(gridCells(exitPlace[0]), gridCells(exitPlace[1]))
    this.addChild(exit);

  }

}

/**
 * 
 * @param {Number} width 
 * @param {Number} height 
 * @returns {[[Number]]}
 */
function getMiddlePosition(width, height) {
  return [Math.floor(width / 2), Math.floor(height / 2)]
}