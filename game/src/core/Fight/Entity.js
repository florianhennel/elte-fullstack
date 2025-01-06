import { dealCards } from "../../cardgame/helpers/cardUIFunctions"

export class Entity {
  constructor({ hp, deffense, energy }, cardgame) {
    this.hp = hp
    this.deffense = deffense
    this.energy = energy
    this.energyLeft = this.energy
    this.cardgame = cardgame
  }

  attack(target, attackPoints) {
    target.takeDamage(attackPoints)
  }

  takeDamage(damagePoints) {
    damagePoints -= this.deffense
    this.hp -= Math.max(0, damagePoints)
  }

  heal(hp) {
    this.hp += hp
  }

  startTurn() {
    this.energyLeft = this.energy
  }

  async dealCards(num) {
    console.log('WTF')
    console.assert(this.cardgame != undefined, 'CardGame is undefined')
    await dealCards(this.cardgame.container, this.cardgame.deck.draw(num))
  }
}