import enemyStats from '../../data/enemies.json'
import { makeEnemyFromActions } from './makeEnemyFromActions'
export const enemies = new Map(
  [
    [
      1,
      makeEnemyFromActions([
        {
          freq: 1,
          effect: (player, enemy) => {
            enemy.attack(player, 1)
          }
        }
      ])
    ],
    [
      2,
      makeEnemyFromActions([
        {
          freq: 1,
          effect: (player, enemy) => {
            enemy.attack(player, 1)
          }
        },
        {
          freq: 1,
          effect: (player, enemy) => {
            enemy.attack(player, 2)
          }
        }
      ])
    ],
    [
      3,
      makeEnemyFromActions([
        {
          freq: 1,
          effect: (player, enemy) => {
            enemy.attack(player, 3)
          }
        },
        {
          freq: 1,
          effect: (player, enemy) => {
            enemy.attack(player, 4)
          }
        }
      ])
    ],
    [
      4,
      makeEnemyFromActions([
        {
          freq: 3,
          effect: (player, enemy) => {
            enemy.attack(player, 1)
          }
        },
        {
          freq: 1,
          effect: (player, enemy) => {
            enemy.attack(player, 3)
          }
        }
      ])
    ]
  ]
)