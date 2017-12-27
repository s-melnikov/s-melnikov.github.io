class Block {
  constructor (index, previousHash, timestamp, data, hash, nonce) {
    this.index = index
    this.previousHash = previousHash
    this.timestamp = timestamp
    this.data = data
    this.hash = hash
    this.nonce = nonce
  }

  static get genesis() {
    return new Block(0, "0", 1508270000000, "Welcome to Blockchain Demo 2.0!",
      "000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf", 604)
  }
}

class Blockchain {
  constructor() {
    this.blockchain = [Block.genesis]
    this.difficulty = 3
  }

  get() {
    return this.blockchain
  }

  get latestBlock() {
    return this.blockchain[this.blockchain.length - 1]
  }

  isValidHashDifficulty(hash) {
    for (var i = 0; i < hash.length; i++) {
      if (hash[i] !== "0") {
        break
      }
    }
    return i >= this.difficulty
  }

  calculateHashForBlock(block) {
    const { index, previousHash, timestamp, data, nonce } = block
    return this.calculateHash(index, previousHash, timestamp, data, nonce)
  }

  calculateHash(index, previousHash, timestamp, data, nonce) {
    return sha256(index + previousHash + timestamp + data + nonce)
  }

  mine(data) {
    const newBlock = this.generateNextBlock(data)
    try {
      this.addBlock(newBlock)
    } catch(err) {
      throw err
    }
  }

  generateNextBlock(data) {
    const nextIndex = this.latestBlock.index + 1
    const previousHash = this.latestBlock.hash
    let timestamp = new Date().getTime()
    let nonce = 0
    let nextHash = this.calculateHash(nextIndex, previousHash, timestamp, data,
      nonce)

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1
      timestamp = new Date().getTime()
      nextHash = this.calculateHash(nextIndex, previousHash, timestamp, data,
        nonce)
    }

    return new Block(nextIndex, previousHash, timestamp, data, nextHash,
      nonce)
  }
  
  recalculateBlockHash({ index, previousHash, timestamp, data }) {
    let nonce = 0
    let hash = this.calculateHash(index, previousHash, timestamp, data, nonce)
    while (!this.isValidHashDifficulty(hash)) {
      nonce = nonce + 1
      hash = this.calculateHash(index, previousHash, timestamp, data, nonce)
    }
    return { index, previousHash, timestamp, data, hash, nonce }
  }

  addBlock(newBlock) {
    if (this.isValidNextBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock)
    } else {
      throw "Error: Invalid block"
    }
  }

  isValidNextBlock(nextBlock, previousBlock) {
    const nextBlockHash = this.calculateHashForBlock(nextBlock)
    if (previousBlock.index + 1 !== nextBlock.index) {
      return false
    } else if (previousBlock.hash !== nextBlock.previousHash) {
      return false
    } else if (nextBlockHash !== nextBlock.hash) {
      return false
    } else if (!this.isValidHashDifficulty(nextBlockHash)) {
      return false
    } else {
      return true
    }
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
      return false
    }
    const tempChain = [chain[0]]
    for (let i = 1; i < chain.length; i = i + 1) {
      if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
        tempChain.push(chain[i])
      } else {
        return false
      }
    }
    return true
  }

  isChainLonger(chain) {
    return chain.length > this.blockchain.length
  }

  replaceChain(newChain) {
    if (this.isValidChain(newChain) && this.isChainLonger(newChain)) {
      this.blockchain = JSON.parse(JSON.stringify(newChain))
    } else {
      throw "Error: invalid chain"
    }
  }
}
