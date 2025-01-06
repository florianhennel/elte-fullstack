import { Deck } from "../Deck"
import { sleep } from "./sleep"

/**
 * 
 * @param {HTMLDivElement} container 
 * @param {[any]} cards 
 */
export async function dealCards(container, cards) {
  const handDiv = container.querySelector('#player-hand')
  for (const c of cards) {
    await sleep(100)
    const img = document.createElement('img')
    img.src = `${c.image}`
    img.classList.add('card')
    img.setAttribute('data-id', c.localId)
    img.setAttribute('draggable', false)
    handDiv.appendChild(img)
  }
}

/**
 * 
 * @param {HTMLDivElement} container 
 * @param {Deck} deck
 */
export async function discardCards(container, deck) {
  const cards = container.querySelectorAll('#player-hand .card')
  for (const card of cards) {
    const c = deck.getCardByLocalId(card.getAttribute('data-id'))
    deck.discard(c)
    card.remove()
    await sleep(100)
  }
}