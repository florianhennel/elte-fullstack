import { Sprite } from "../engine/Sprite.js";
import { Vector2 } from "../engine/types/Vectors.js";
import { Level } from "../objects/Level/Level.js";
import { resources } from "../engine/Resources/Resource.js";
import { gridCells } from "../helpers/grid.js";
import { Exit } from "../objects/Exit/Exit.js";
import { Hero } from "../objects/Hero/Hero.js";
import { events } from "../engine/Events/Events.js";
import { OutdoorLevel1 } from "./OutdoorLevel1.js";
import { GeneratedDungeon } from "./GeneratedDungeon.js";
import { gridSize } from "../engine/config/config.json"
import { Room } from "../objects/Rooms/Room.js";
import { placeRooms } from "./helpers/placeRooms.js";
import { Market } from "../objects/Rooms/Market.js";
import { Boss } from "../objects/Rooms/Boss.js";
import { Fight } from "../objects/Rooms/Fight.js";

export class GeneratedLevel extends Level {
  constructor(params) {
    console.assert(params?.dungeonParameters != undefined, "Undefined property")
    console.assert(params?.roomParameters != undefined, "Undefined property")
    console.assert(params?.itemGenerator != undefined, "Undefined property")
    console.assert(params?.enemyGenerator != undefined, "Undefined property")
    super({});

    this.background = new Sprite({
      resource: resources.images.lavafloor,
      frameSize: new Vector2(320, 180)
    })

    let roomMapping = undefined
    while (true) {
      params.dungeonParameters.seed = Math.floor(Math.random() * 99999)
      this.dungeon = new GeneratedDungeon(params.dungeonParameters)

      try {
        roomMapping = placeRooms(this.dungeon.dungeon, params.roomParameters)
        break;
      } catch {
        console.warn('retrying dungeon generation')
        continue;
      }
    }

    console.log('seed', params.dungeonParameters.seed)
    let [w, h] = this.dungeon.dungeon.size

    //create background
    const ground = new Sprite({
      resource: { isLoaded: true, image: this.dungeon.getBackgroundImage() },
      frameSize: new Vector2(w * gridSize, h * gridSize)
    })

    this.addChild(ground)

    //add hero
    this.heroStartPosition = this.dungeon.dungeon.start_pos
    const hero = new Hero(...new Vector2(...this.heroStartPosition).mul(gridSize))
    this.addChild(hero)

    //add rooms
    this.rooms = this.dungeon.rooms.map(r => {
      const room = createRoom(r, roomMapping.get(r.id), {
        itemGenerator: params.itemGenerator,
        enemyGenerator: params.enemyGenerator,
      })
      return room
    })

    this.rooms.forEach(r => this.addChild(r))

    //add walls
    this.walls = this.dungeon.getWalls();
  }
}

/**
 * 
 * @param {Room2} r 
 * @param {string} type 
 * @param {...Object} args 
 * @returns {Room}
 */
function createRoom(r, type, args) {
  let param = {
    position: new Vector2(... new Vector2(...r.position).mul(gridSize)),
    size: new Vector2(... new Vector2(...r.room_size).mul(gridSize)),
    ...args
  }

  switch (type) {
    case "market":
      return new Market(param)
    case "boss":
      return new Boss(param)
    case "fight":
      return new Fight(param)
    default:
      return new Room(param)
  }
}