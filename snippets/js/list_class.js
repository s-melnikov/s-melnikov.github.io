class List {
  constructor() {
    this.memory = []
    this.length = 0
  }

  get(address) {
    return this.memory[address]
  }

  push(value) {
    this.memory[this.length] = value
    this.length++
  }

  pop() {
    if (this.length === 0) return
    var lastAddress = this.length - 1
    var value = this.memory[lastAddress]
    delete this.memory[lastAddress]
    this.length--

    return value
  }

  unshift(value) {
    var previous = value

    for (var address = 0; address < this.length; address++) {
      var current = this.memory[address]
      this.memory[address] = previous
      previous = current
    }

    this.memory[this.length] = previous
    this.length++
  }

  shift() {
    if (this.length === 0) return

    var value = this.memory[0]
    for (var address = 0; address < this.length - 1; address++) {
      this.memory[address] = this.memory[address + 1]
    }

    delete this.memory[this.length - 1]
    this.length--

    return value
  }

}