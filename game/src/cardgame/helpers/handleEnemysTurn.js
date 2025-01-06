import { sleep } from "./sleep"

export async function handleEnemysTurn(cardgame) {
  await sleep(200)
  console.log(cardgame.enemy)
  cardgame.enemy.playturn(cardgame)
  await sleep(600)
}