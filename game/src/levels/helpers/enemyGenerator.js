export function* enemyGenerator(itemList) {
  const allitems = []
  let sum = 0

  for (const e of itemList) {
    sum += e.freq
    allitems.push({ ...e, freq: sum })
  }

  while (true) {
    const rand = Math.random() * sum
    const item = allitems.find(e => e.freq >= rand)

    console.assert(item != undefined, "Item not found")

    yield item
  }
}