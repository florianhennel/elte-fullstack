import { events } from "../engine/Events/Events";
import { GeneratedLevel } from "./GeneratedLevel";
import { Level2 } from "./Level2";
import defaultDungeonConfig from "./data/default-dungeon-settings.json"
import roomConfig from "../data/levels/rooms/level1.json"
import itemList from "../data/levels/items/level1.json"
import enemyList from "../data/levels/enemies/level1.json"
import { getLevelParameters } from "./helpers/getLevelParameters";

export class Level1 extends GeneratedLevel {
  constructor() {
    super(getLevelParameters(defaultDungeonConfig, roomConfig, itemList, enemyList))
  }

  ready() {
    events.on("HERO_EXITS", this, () => {
      events.emit("CHANGE_LEVEL", new Level2())
    })
  }
}