/**
 * Handles communication to server when an event occurs.
 * Handles fightscenes.
 */

import { events } from "./Events"
import { CardGame } from '../../cardgame/CardGame'
import { EndgameScreen } from "../../helpers/EndgameScreen"


export class EventHandler {
  constructor(gameLoop, gameState) {
    events.on("HERO_PICKS_UP_ITEM", this, data => {
      const id = data.data.id
      if (data.data.type == 'card') {
        gameState.addCard(id)
      } else {
        console.warn("implement communication to server", data)
        console.warn(`picked up item with id ${id}`)
        window.parent.postMessage(id, "*");
      }
    })

    events.on("FIGHT_START", this, enemy => {
      new CardGame({ gameLoop, gameState, enemyId: enemy.id }).start()
    })

    events.on("GAME_OVER", this, data => {
      new EndgameScreen(data)
    })
  }
}
