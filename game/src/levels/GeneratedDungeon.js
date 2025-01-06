import Dungeon from 'dungeon-generator';
import { gridSize } from "../engine/config/config.json"
import { placeRooms } from './helpers/placeRooms';

export class GeneratedDungeon {
  constructor(params) {
    console.assert(params != null && params != undefined, "Unset dungeon parameters")
    let dungeon = new Dungeon(params)

    dungeon.generate()

    this.dungeon = dungeon
    // corridors are <= height 3xY or Xx3
    this.rooms = dungeon.children.filter(c => c.size.every(e => e > 3))
  }

  getBackgroundImage() {
    const canvas = document.createElement("canvas")
    canvas.setAttribute("width", this.dungeon.size[0] * gridSize)
    canvas.setAttribute("height", this.dungeon.size[1] * gridSize)

    const ctx = canvas.getContext('2d')

    const wallImage = new Image()
    const tileImage = new Image()

    wallImage.onload = () => {
      tileImage.onload = () => drawBackground(ctx, this.dungeon, wallImage, tileImage)
      tileImage.src = 'sprites/tile.png'
    }

    wallImage.src = 'sprites/wall.png'

    return canvas
  }

  getWalls() {
    let walls = new Set()
    this.dungeon.walls.rows.forEach((row, y) => row.forEach((b, x) => b && walls.add(`${x * gridSize},${y * gridSize}`)))
    return walls
  }

}


function drawBackground(ctx, dungeon, wallImage, tileImage) {
  for (let y = 0; y < dungeon.size[1]; y++) {
    for (let x = 0; x < dungeon.size[0]; x++) {
      // tile
      if (!dungeon.walls.get([x, y])) {
        ctx.drawImage(tileImage, x * gridSize, y * gridSize)
        continue
      }

      let toskip = true
      for (let i = y - 1; i <= y + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {
          if (i < 0 || i >= dungeon.size[1])
            continue
          if (j < 0 || j >= dungeon.size[0])
            continue
          if (!dungeon.walls.get([j, i]))
            toskip = false
        }
      }
      if (toskip)
        continue

      // wall
      ctx.drawImage(wallImage, x * gridSize, y * gridSize)
    }
  }
}