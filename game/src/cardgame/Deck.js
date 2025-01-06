import { loadCards } from "./helpers/loaders";

export class Deck {
  constructor({ cards }) {
    this.discardPile = []
    this.drawPile = shuffle(loadCards(cards))
    this.allCards = [...this.drawPile]
  }

  draw(amount) {
    let cards = this.drawPile.splice(0, amount)
    if (cards.length < amount) {
      this.drawPile = shuffle(this.discardPile)
      this.discardPile = []
      cards = cards.concat(this.drawPile.splice(0, amount - cards.length))
    }
    return cards
  }

  getCardByLocalId(localId) {
    return this.allCards.find(c => c.localId == localId)
  }

  discard(card) {
    this.discardPile.push(card)
  }
}


// credit: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let pivot = array.length

  while (pivot > 0) {
    const idx = Math.floor(Math.random() * pivot--)
      ;[array[pivot], array[idx]] = [array[idx], array[pivot]]
  }
  return array
}