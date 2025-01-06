/**
 * 
 * @param {T[]} array 
 * @returns {T[]}
 * @template T
 */
export function shuffle(array) {
  const result = [...array]

  for (let idx = 0; idx < array.length; idx++) {
    const randIdx = idx + Math.floor(Math.random() * (array.length - idx))
      ;[result[randIdx], result[idx]] = [result[idx], result[randIdx]]
  }
  return result
}