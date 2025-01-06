import { events } from "../engine/Events/Events";
import { GeneratedLevel } from "./GeneratedLevel";
import { Level3 } from "./Level3";
import defaultDungeonConfig from "./data/default-dungeon-settings.json"
import roomConfig from "../data/levels/rooms/level2.json"
import itemList from "../data/levels/items/level2.json"
import enemyList from "../data/levels/enemies/level2.json"
import { getLevelParameters } from "./helpers/getLevelParameters";

export class Level2 extends GeneratedLevel {
  constructor() {
    super(getLevelParameters(defaultDungeonConfig, roomConfig, itemList, enemyList))
  }

  ready() {
    events.on("HERO_EXITS", this, () => {
      events.emit("CHANGE_LEVEL", new Level3())
    })
  }
}