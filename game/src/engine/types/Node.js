export class Node {
  constructor(name = "", value = {}) {
    /**
     * @type {[Node]}
     */
    this.children = []
    this.name = name
    this.value = value
  }

  addChild(node) {
    this.children.push(node)
  }

  duplicate() {
    const node = new Node(this.name, { ...this.value })
    node.children = [...this.children]
    return node
  }
}