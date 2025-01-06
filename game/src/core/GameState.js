import initialCards from '../data/config/initial-cards.json'
import initialStats from '../data/config/initial-player-stats.json'

export class GameState {
  constructor() {
    this.cards = initialCards
    this.playerStats = initialStats
  }

  getCards() {
    return [...this.cards]
  }

  addCard(card) {
    console.log(card, 'card added')
    this.cards.push(card)
  }
}