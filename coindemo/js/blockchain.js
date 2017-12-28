class Blockchain {
  
  constructor() {
    this.difficulty = 3;
    this.blockchain = [this.getGenesisBlock()];
  }
  
  getGenesisBlock() {
    let index = 0
    let hash = "0"
    let timestamp = Date.now()
    let data = []
    let merkle = this.getMerkleRoot(data)
    let nonce = this.getNonce(index, hash, timestamp, merkle)
    return {
      index,
      hash,
      timestamp,
      data,
      merkle,
      nonce
    }
  }
  
  getMerkleRoot(data) {
    if (!data.length) return sha256("")
  }
  
  getNonce(index, hash, timestamp, merkle) {
    let nonce = 0
    while(
      !this.isValidHashDifficulty(
        this.calculateHash(index, hash, timestamp, merkle, nonce)
      )
    ) {
      nonce++
    }
    return nonce
  }

  calculateHash(index, hash, timestamp, merkle, nonce) {
    return sha256(index + hash + timestamp + merkle + nonce)
  }

  isValidHashDifficulty(hash) {
    for (var i = 0; i < hash.length; i++) {
      if (hash[i] !== "0") {
        break;
      }
    }
    return i >= this.difficulty;
  }
  
  
  

  getChain() {
    return this.blockchain;
  }

  latestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  calculateHashForBlock(block) {
    const { index, previousHash, timestamp, data, nonce } = block;
    return this.calculateHash(
      index,
      previousHash,
      timestamp,
      data,
      nonce
    );
  }

  mine(data) {
    const newBlock = this.generateNextBlock(data);
    try {
      this.addBlock(newBlock);
    } catch(err) {
      throw err;
    }
  }

  generateNextBlock(data) {
    const index = this.latestBlock().index + 1;
    const hash = this.latestBlock.hash;
    let timestamp = new Date().getTime();
    let nonce = getNonce()
    let nonce = 0;
    let nextHash = this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nonce
    );

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      nextHash = this.calculateHash(
        nextIndex,
        previousHash,
        timestamp,
        data,
        nonce
      );
    }

    const nextBlock = new Block(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nextHash,
      nonce
    );

    return nextBlock;
  }

  addBlock(newBlock) {
    if (this.isValidNextBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock);
    } else {
      throw "Error: Invalid block";
    }
  }

  isValidNextBlock(nextBlock, previousBlock) {
    const nextBlockHash = this.calculateHashForBlock(nextBlock);

    if (previousBlock.index + 1 !== nextBlock.index) {
      return false;
    } else if (previousBlock.hash !== nextBlock.previousHash) {
      return false;
    } else if (nextBlockHash !== nextBlock.hash) {
      return false;
    } else if (!this.isValidHashDifficulty(nextBlockHash)) {
      return false;
    } else {
      return true;
    }
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
      return false;
    }

    const tempChain = [chain[0]];
    for (let i = 1; i < chain.length; i = i + 1) {
      if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
        tempChain.push(chain[i]);
      } else {
        return false;
      }
    }
    return true;
  }

  isChainLonger(chain) {
    return chain.length > this.blockchain.length;
  }

  replaceChain(newChain) {
    if (this.isValidChain(newChain) && this.isChainLonger(newChain)) {
      this.blockchain = JSON.parse(JSON.stringify(newChain));
    } else {
      throw "Error: invalid chain";
    }
  }
}
