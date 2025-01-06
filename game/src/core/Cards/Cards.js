export const cardEffects = new Map(
  [
    [
      1,
      (player, enemy) => {
        player.attack(enemy, 3)
      }
    ],
    [
      2,
      (player, enemy) => {
        player.attack(enemy, 5)
      }
    ],
    [
      3,
      (player, enemy) => {
        player.attack(enemy, 1)
      }
    ],
    [
      4,
      (player, enemy) => {
        player.energyLeft += 3
      }
    ],
    [
      5,
      (player, enemy) => {
        player.heal(2)
      }
    ],
    [
      6,
      (player, enemy) => {
        //
      }
    ],
    [
      7,
      (player, enemy) => {
        player.deffense++
      }
    ],
    [
      8,
      (player, enemy) => {
        player.attack(enemy, 1 + Math.floor(Math.random() * 6))
      }
    ],
    [
      9,
      (player, enemy) => {
        player.attack(enemy, 9999)
      }
    ],
    [
      10,
      async (player, enemy) => {
        await player.dealCards(4)
      }
    ]
  ]
)