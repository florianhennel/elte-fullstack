import { CardGame } from "./CardGame"
import { Deck } from "./Deck"

export class UserControls {
  /**
   * 
   * @param {CardGame} container 
   */
  constructor(cardgame) {
    this.container = cardgame.container
    this.cardgame = cardgame
    this.cardClickHandler = this.handleCardClick.bind(this)
    this.keyDownHandler = this.handleKeyDown.bind(this)
  }

  enable() {
    // end turn button
    const endTurnBtn = this.container.querySelector('#end-turn')
    endTurnBtn.onclick = () => {
      this.disable()
      this.toResolve()
    }

    // card clicks
    const cards = this.container.querySelectorAll('.card')
    cards.forEach(c => c.addEventListener('click', this.cardClickHandler))

    // cheatcodes
    this.keystrokes = ''
    document.addEventListener('keydown', this.keyDownHandler)
  }

  handleKeyDown(event) {
    const text = (this.keystrokes + event.key).slice(-10)
    this.keystrokes = ''

    // cheatcodes
    if (text.match('hpup')) {
      this.cardgame.playerEntity.hp = 100
    } else if (text.match('kill')) {
      this.cardgame.enemyEntity.hp = 0
      this.disable()
      this.toResolve()
    } else if (text.match('die')) {
      this.cardgame.playerEntity.hp = 0
      this.disable()
      this.toResolve()
    } else {
      this.keystrokes = text
    }
  }

  async handleCardClick(event) {
    const deck = this.cardgame.deck
    const localId = event.target.getAttribute('data-id')
    const card = deck.getCardByLocalId(localId)

    // check energy
    if (this.cardgame.playerEntity.energyLeft < card.cost)
      return
    this.cardgame.playerEntity.energyLeft -= card.cost

    // apply cards effect
    await card.effect(this.cardgame.playerEntity, this.cardgame.enemyEntity)

    // if somebody dies end turn
    if (this.cardgame.playerEntity.hp <= 0 || this.cardgame.enemyEntity.hp <= 0) {
      this.disable()
      this.toResolve()
    }

    // remove card from hand
    event.target.remove()
    deck.discard(card)

    console.log('click', this.cardgame.playerEntity, this.cardgame.enemyEntity)
  }

  disable() {
    const endTurnBtn = this.container.querySelector('#end-turn')
    endTurnBtn.onclick = undefined

    const cards = this.container.querySelectorAll('.card')
    cards.forEach(c => c.removeEventListener('click', this.cardClickHandler))

    document.removeEventListener('keydown', this.keyDownHandler)
  }

  handlePlayerTurn() {
    const promise = new Promise(res => this.toResolve = res)
    this.enable()
    return promise
  }

}