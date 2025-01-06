import { Node } from "../../engine/types/Node"
import { generateCombinations } from "../../helpers/generateCombinations"
import { shuffle } from "../../helpers/shuffle"

const MAX_NUMBER_OF_RETRIES = 20

export function placeRooms(dungeon, config) {
  console.assert(config != null && config != undefined, "Unset room configuration")

  const graph = constructGraph(dungeon.children)
  const rooms = getSimplifiedGraph(graph, dungeon)

  checkInvariants(dungeon, rooms, config)

  /**
   * @type {Map<number, string>}
   */
  let roomTags, i

  for (i = 0; i < MAX_NUMBER_OF_RETRIES; i++) {
    roomTags = new Map()
    try {
      placeBossRooms(rooms, config, roomTags)
      placeMarketRooms(rooms, config, roomTags)
      placeFightRooms(rooms, config, roomTags)
      break
    } catch {
      // console.warn("retrying")
    }
  }

  if (i === MAX_NUMBER_OF_RETRIES)
    throw Error("Implement new dungeon request...")


  return roomTags
}


/**
 * 
 * @param {*} dungeon 
 * @param {[Node]} rooms 
 * @param {*} config 
 */
function checkInvariants(dungeon, rooms, config) {
  const startingRoom = dungeon.children[0]
  if (startingRoom.tag !== "initial")
    throw Error("Invariant for starting room is incorrect")


  const numberOfTaggedRooms = Object.values(config).reduce((acc, curr) => acc + curr.count, 0)
  //starting room can't be tagged
  if (rooms.length - 1 < numberOfTaggedRooms)
    throw Error("Too much rooms to place")
}



/**
 * 
 * @param {*} rooms 
 * @returns {[Node]} 
 */
function constructGraph(rooms) {
  let nodes = rooms.map(r => new Node(r.id, {}))
  let nodesMapping = new Map(nodes.map(n => [n.name, n]))

  rooms.forEach(r => {
    r.exits.forEach(e => nodesMapping.get(r.id).addChild(nodesMapping.get(e[2].id)))
  })
  return nodes
}



/**
 * Calculates distance between two nodes
 * @param {Node} node1 
 * @param {Node} node2 
 * @returns {int} 
 */
function distance(node1, node2) {
  const reached = new Set([node1])
  const visited = new Set()
  let distance = 0

  while (!reached.has(node2) && reached.size > 0) {
    const toVisit = [...reached]
    reached.clear()
    toVisit.forEach(n => visited.add(n))

    toVisit.forEach(n => n.children.forEach(c => {
      if (visited.has(c))
        return
      reached.add(c)
    }))

    distance++
  }

  if (reached.has(node2))
    return distance
  return undefined
}



/**
 * Removes corridors from the graph
 * @param {[Node]} graph 
 * @returns {[Node]}
 */
function getSimplifiedGraph(graph, dungeon) {
  /**
   * @type {Map<string, Node>}
   */
  const nameToNode = new Map(graph.map(n => [n.name, n]))

  const dcMapping = new Map(dungeon.children.map(c => [c.id, c]))
  const isRoom = r => dcMapping.get(r.name).size.every(e => e > 3)
  const roomNames = graph.filter(isRoom).map(r => r.name)

  const corridorNames = new Set(graph.filter(r => !isRoom(r)).map(r => r.name))

  const rooms = roomNames.map(r => {
    const room = nameToNode.get(r).duplicate()
    room.children = room.children.map(c => c.name).map(c => {
      if (!corridorNames.has(c))
        return c
      return nameToNode.get(c).children.map(e => e.name).filter(e => e !== r)
    }).flat(1)
    return room
  })

  /**
   * @type {Map<string, Node>}
   */
  const nameToNewNode = new Map(rooms.map(n => [n.name, n]))

  rooms.forEach(r => r.children = r.children.map(
    c => nameToNewNode.get(c)
  ))

  return rooms
}






/**
 * 
 * @param {[Node]} rooms 
 * @param {*} config 
 * @param {Map<number, string>} roomTags 
 */
function placeBossRooms(rooms, config, roomTags) {
  // boss should be a leaf node
  let possibleBossRooms = rooms.filter(r => r.children.length === 1)

  // boss should be at leas n rooms away from starting position
  const minDistance = config.boss.minDistanceFromStartPosition
  const startingRoom = rooms[0]
  possibleBossRooms = possibleBossRooms.filter(r => distance(startingRoom, r) >= minDistance)

  for (let i = 0; i < config.boss.count; i++) {
    let idx = Math.floor((Math.random() - 0.00001) * possibleBossRooms.length)
    roomTags.set(possibleBossRooms[idx].name, "boss")
    possibleBossRooms.splice(idx, 1)
  }

}



/**
 * 
 * @param {[Node]} rooms 
 * @param {*} config 
 * @param {Map<number, string>} roomTags 
 */
function placeMarketRooms(rooms, config, roomTags) {
  const chosenRooms = getFreeRoomsWithDistance(
    rooms,
    roomTags,
    config.market.count,
    config.market.minDistanceBetweenMarkets
  )

  if (chosenRooms === null)
    throw Error("Can't be resolved")

  chosenRooms.forEach(r => roomTags.set(r.name, "market"))

}



/**
 * 
 * @param {[Node]} rooms 
 * @param {*} config 
 * @param {Map<number, string>} roomTags 
 */
function placeFightRooms(rooms, config, roomTags) {
  const chosenRooms = getFreeRoomsWithDistance(
    rooms,
    roomTags,
    config.fight.count,
    0
  )

  if (chosenRooms === null)
    throw Error("Can't be resolved")

  chosenRooms.forEach(r => roomTags.set(r.name, "fight"))

}




/**
 * 
 * @param {Node[]} rooms 
 * @param {Map<number, string>} roomTags 
 * @param {number} count 
 * @param {number} distance 
 */
function getFreeRoomsWithDistance(rooms, roomTags, count, minDistance) {
  // exclude starting room
  let possibleRooms = rooms.slice(1)

  // exclude already tagged rooms
  possibleRooms = possibleRooms.filter(r => roomTags.get(r.name) === undefined)

  possibleRooms = shuffle(possibleRooms)

  const combinations = generateCombinations(
    possibleRooms.length,
    count
  );

  const checkPlacement = rooms => {
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        if (distance(rooms[i], rooms[j]) < minDistance) {
          return false
        }
      }
    }
    return true
  }

  let indices, found = false, chosenRooms
  for (indices of combinations) {
    chosenRooms = indices.map(index => possibleRooms[index])
    if (checkPlacement(chosenRooms)) {
      found = true
      break
    }
  }

  if (!found) {
    return null
  }

  return chosenRooms
}