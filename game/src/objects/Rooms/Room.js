import { events } from "../../engine/Events/Events";
import { GameObject } from "../../engine/GameObject";
import { gridSize } from "../../engine/config/config.json"

export class Room extends GameObject {
  #roomEventId

  constructor({ position, size }) {
    super({ position })
    this.size = size
    this.visited = false
    this.drawLayer = "FLOOR"
  }

  ready() {
    this.#roomEventId = events.on("HERO_POSITION", this, pos => {
      // detect room enter
      const roundedHeroX = Math.round(pos.x)
      const roundedHeroY = Math.round(pos.y)

      const [roomX, roomY] = this.position.xy
      const [roomWidth, roomHeight] = this.size.xy

      if (roundedHeroX < roomX || roundedHeroY < roomY) {
        return
      }

      if (roundedHeroX > roomX + roomWidth || roundedHeroY > roomY + roomHeight) {
        return
      }

      this.onRoomEnter()
    })
  }

  onRoomEnter() {
    //if inside the room
    this.visited = true
    events.off(this.#roomEventId)
    events.emit("HERO_ENTER_ROOM", this)
  }
}