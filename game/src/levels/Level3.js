import { events } from "../engine/Events/Events";
import { GeneratedLevel } from "./GeneratedLevel";
import defaultDungeonConfig from "./data/default-dungeon-settings.json"
import roomConfig from "../data/levels/rooms/level3.json"
import itemList from "../data/levels/items/level3.json"
import enemyList from "../data/levels/enemies/level3.json"
import { getLevelParameters } from "./helpers/getLevelParameters";

export class Level3 extends GeneratedLevel {
  constructor() {
    super(getLevelParameters(defaultDungeonConfig, roomConfig, itemList, enemyList))
  }

  ready() {
    events.on("HERO_EXITS", this, () => {
      events.emit("GAME_OVER", { win: true })
    })
  }
}