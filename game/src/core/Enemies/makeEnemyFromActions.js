export function makeEnemyFromActions(actions) {
  return new FreqListEnemy(actions)
}

class FreqListEnemy {
  constructor(actions) {
    this.generator = freqListRandomChooser(actions)
  }

  playturn(cardgame) {
    const player = cardgame.playerEntity
    const enemy = cardgame.enemyEntity
    this.generator.next().value.effect(player, enemy)
  }
}

export function* freqListRandomChooser(list) {
  const allitems = []
  let sum = 0

  list.forEach(e => {
    sum += e.freq
    allitems.push({ ...e, freq: sum })
  })

  while (true) {
    const rand = Math.random() * sum
    const item = allitems.find(e => e.freq >= rand)

    console.assert(item != undefined, "Item not found")

    yield item
  }
}