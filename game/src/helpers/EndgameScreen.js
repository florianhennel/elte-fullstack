export class EndgameScreen {
  constructor({ win }) {
    const div = document.createElement('div')
    div.id = 'endgame-screen'

    const img = document.createElement('img')
    img.src = `sprites/${win ? 'youwon' : 'youdied'}.png`
    div.appendChild(img)

    const body = document.querySelector('body')
    body.appendChild(div)
  }
}