import { itemGenerator } from "./itemGenerator"
import { enemyGenerator } from "./enemyGenerator"

/**
 * 
 * @param {Object} dconfig dungeon config
 * @param {Object} rconfig room config
 * @returns {Object} parameters
 */
export function getLevelParameters(dconfig, rconfig, itemList, enemyList) {
  let params = {}

  params.dungeonParameters = dconfig
  params.dungeonParameters.room_count = rconfig.roomCount

  params.roomParameters = rconfig

  params.itemGenerator = itemGenerator(itemList)

  params.enemyGenerator = enemyGenerator(enemyList)

  return params
}