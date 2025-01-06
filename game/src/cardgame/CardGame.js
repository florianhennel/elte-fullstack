import { Entity } from "../core/Fight/Entity"
import { Deck } from "./Deck"
import { UserControls } from "./UserControls"
import { createUI } from "./helpers/createUI"
import { dealCards, discardCards } from "./helpers/cardUIFunctions"
import { handleEnemysTurn } from "./helpers/handleEnemysTurn"
import { loadEnemy } from "./helpers/loaders"
import { events } from "../engine/Events/Events"

export class CardGame {
  constructor({ gameLoop, gameState, enemyId }) {
    this.gameLoop = gameLoop
    this.deck = new Deck({ cards: gameState.getCards() })
    this.enemy = loadEnemy(enemyId)
    this.gameState = gameState
  }

  start() {
    this.gameLoop.stop()

    this.container = createUI(this)

    this.playerEntity = new Entity(this.gameState.playerStats, this)
    this.enemyEntity = new Entity({ hp: this.enemy.hp, deffense: this.enemy.defense })

    this.userControls = new UserControls(this)

    this.playerTurn()
  }

  end() {
    // remove all DOM elements
    this.container.remove()

    // if player dies gameover
    if (this.playerEntity.hp <= 0) {
      events.emit("GAME_OVER", { win: false })
    } else {
      // continue the game
      this.gameLoop.start()
    }
  }

  checkEnd() {
    if (this.playerEntity.hp <= 0 || this.enemyEntity.hp <= 0) {
      this.end()
      return true
    }
    return false
  }

  async playerTurn() {
    // restore energy
    this.playerEntity.startTurn()

    // deal cards
    const hand = this.deck.draw(4)
    await dealCards(this.container, hand)

    // wait until player's turn end
    await this.userControls.handlePlayerTurn()

    if (this.checkEnd())
      return

    // discard cards
    await discardCards(this.container, this.deck)

    // start enemy's turn
    this.enemysTurn()
  }

  async enemysTurn() {
    await handleEnemysTurn(this)

    if (this.checkEnd())
      return

    // start player's turn
    this.playerTurn()
  }
}