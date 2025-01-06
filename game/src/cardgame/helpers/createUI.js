export function createUI(cardgame) {
  const body = document.querySelector('body')

  // create container
  const container = document.createElement('div')
  container.id = 'cardgame-container'
  body.appendChild(container)

  // end turn button
  const endTurnBtn = document.createElement('button')
  endTurnBtn.id = 'end-turn'
  endTurnBtn.innerText = 'Vége'
  container.appendChild(endTurnBtn)

  // player hand
  const playerHandDiv = document.createElement('div')
  playerHandDiv.id = 'player-hand'
  container.appendChild(playerHandDiv)

  // enemy img
  const enemyImg = document.createElement('img')
  enemyImg.src = cardgame.enemy.image
  enemyImg.id = 'enemy-img'
  container.appendChild(enemyImg)

  // display stats
  const displayDiv = document.createElement('div')
  displayDiv.id = 'disp-stats'
  const enemyStatsSpan = document.createElement('span')
  enemyStatsSpan.id = 'enemy-stats'
  const playerStatsSpan = document.createElement('span')
  playerStatsSpan.id = 'player-stats'

  displayDiv.appendChild(enemyStatsSpan)
  displayDiv.appendChild(playerStatsSpan)
  container.appendChild(displayDiv)

  setInterval(() => refreshStats(cardgame), 50)

  // TODO stop interval

  return container
}

function refreshStats(cardgame) {
  const enemyStatsSpan = cardgame.container.querySelector('#enemy-stats')
  enemyStatsSpan.innerHTML = `
    &nbsp; &nbsp; &nbsp; ENEMY &nbsp; &nbsp; &nbsp; <br>
    hp: ${cardgame.enemyEntity.hp} <br>
    deffense: ${cardgame.enemyEntity.deffense} <br>
    `

  const playerStatsSpan = cardgame.container.querySelector('#player-stats')
  playerStatsSpan.innerHTML = `
    &nbsp; &nbsp; &nbsp; PLAYER &nbsp; &nbsp; &nbsp; <br>
    hp: ${cardgame.playerEntity.hp} <br>
    deffense: ${cardgame.playerEntity.deffense} <br>
    energy: ${cardgame.playerEntity.energyLeft}
    `
}