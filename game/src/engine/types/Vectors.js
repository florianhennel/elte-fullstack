import { LEFT, RIGHT, UP, DOWN } from "../Input.js";
import config from "../config/config.json"

const letters = ['x', 'y', 'z', 'w']

class VectorN {
  constructor(n, ...values) {
    if (n !== values.length)
      throw Error("Invalid number of arguments for VectorN")

    this.n = n
    this.values = [...values]

    const thisContext = this

    return new Proxy(this, {
      get(target, name) {
        if (name.match(/^[xyzw]+$/))
          return thisContext.#get(name);
        return thisContext[name];
      },

      set(target, name, value) {
        if (name.match(/^[xyzw]$/))
          thisContext.#set(name, value);
        return Reflect.set(...arguments);
      }
    })
  }

  #validateIndexing(prop) {
    const regexMatch = regex => {
      if (!prop.match(regex))
        throw Error("Invalid indexing of type VectorN")
    }

    switch (this.n) {
      case 1:
        regexMatch(/^[x]+$/)
        break
      case 2:
        regexMatch(/^[xy]+$/)
        break
      case 3:
        regexMatch(/^[xyz]+$/)
    }
  }

  #get(prop) {
    this.#validateIndexing(prop)

    let arr = prop.split('').map(c => this.values[letters.indexOf(c)])

    return arr.length === 1 ? arr[0] : arr
  }

  #set(prop, value) {
    this.#validateIndexing(prop)

    this.values[letters.indexOf(prop)] = value
  }

  isEqual(other) {
    return this.n === other.n && this.values.every((e, i) => e === other.values[i])
  }

  mul(n) {
    return this.values.map(x => n * x)
  }

}

export class Vector2 extends VectorN {
  constructor(...values) {
    super(2, ...values)
  }

  duplicate() {
    return new Vector2(...this.xy);
  }

  toNeighbor(dir) {
    let x = this.x;
    let y = this.y;
    if (dir === LEFT) { x -= config.gridSize }
    if (dir === RIGHT) { x += config.gridSize }
    if (dir === UP) { y -= config.gridSize }
    if (dir === DOWN) { y += config.gridSize }
    return new Vector2(x, y)
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y)
  }
}

export class Vector3 extends VectorN {
  constructor(...values) {
    super(3, ...values)
  }

  duplicate() {
    return new Vector3(...this.xyz);
  }
}

export class Vector4 extends VectorN {
  constructor(...values) {
    super(4, ...values)
  }

  duplicate() {
    return new Vector4(...this.xyzw);
  }
}