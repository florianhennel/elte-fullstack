/**
 * Choose k elements from n ones
 * 
 * @param {number} n - number of elements
 * @param {number} k
 * @returns {Generator<number[]>}
 */
export function* generateCombinations(n, k) {
  const combination = [];

  function* backtrack(start) {
    if (combination.length === k) {
      yield Array.from(combination)
      return
    }
    for (let i = start; i < n; i++) {
      combination.push(i)
      yield* backtrack(i + 1)
      combination.pop()
    }
  }

  yield* backtrack(0);
}