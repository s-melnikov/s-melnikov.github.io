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
    }<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
<script>
\n  console.clear()\n  \n  const REELS_COUNT = 3\n  const ROWS_COUNT = 3\n  const SYMBOLS_COUNT = [6, 5, 4, 4, 3, 3, 2, 1]\n  const LINES = [\n    [1, 1, 1, 1, 1],\n    [0, 0, 0, 0, 0],\n    [2, 2, 2, 2, 2],\n    [0, 1, 2, 1, 0],\n    [2, 1, 0, 1, 2],\n    [0, 1, 0, 1, 0],\n    [2, 1, 2, 1, 2], \n    [0, 1, 1, 1, 0],\n    [2, 1, 1, 1, 2]\n  ]\n  const WIN_COMB = [\n    [0, 0, 5, 15, 25],\n    [0, 0, 5, 15, 25],\n    [0, 0, 10, 25, 50],\n    [0, 0, 25, 50, 100],\n    [0, 25, 50, 100, 250],\n    [0, 25, 50, 100, 500],\n    [0, 50, 150, 250, 500],\n    [0, 50, 250, 500, 1000]\n  ]\n  let bet = 1\n  let money = 1000\n  let playing_lines_count = 1\n  let symbols = []\n  \n  function randomInt(min, max) {\n    return Math.floor(Math.random() * (max - min)) + min\n  }\n  \n  function shuffleArray(a) {\n    var i = a.length, j, x\n    for (; i; i--) {\n      j = Math.floor(Math.random() * i)\n      x = a[i - 1]\n      a[i - 1] = a[j]\n      a[j] = x\n    }\n  }\n  \n  function getRandomSymbols() {\n    var symbols = []\n    var shift\n    var reel\n    for (var i = 0; i < REELS_COUNT; i++) {\n      shift = randInt(0, reelSymbols.length - 1)\n      reel = reelSymbols.slice(shift, shift + ROWS_COUNT)\n      if (reel.length < ROWS_COUNT) {\n        reel = reel.concat(reelSymbols.slice(0, ROWS_COUNT - reel.length))\n      }\n      symbols[i] = reel\n    }\n    return symbols\n  }\n  \n  function checkWinLines(symbols) {\n    var result = []\n    var lines = []\n    var playing_lines = PAY_LINES.slice(0, playing_lines_count);\n    for (var line = 0; line < active_lines.length; line ++) {\n      lines[line] = [];\n      for (var reel = 0; reel < active_lines[line].line.length; reel++) {\n        lines[line].push(symbols[reel][active_lines[line].line[reel]])\n      }\n    }\n    for (line = 0; line < lines.length; line++) {\n      var first_symbol = lines[line][0];\n      for (var i = 1; i < lines[line].length && lines[line][i] === first_symbol; i++) {}\n      for (var comb = 0; comb < WIN_COMB[first_symbol].length; comb++) {\n        if (WIN_COMB[first_symbol][comb][0] === i) {\n          result.push({\n            symbol: first_symbol,\n            count: i,\n            line: active_lines[line].line,\n            color: active_lines[line].color,\n            factor: WIN_COMB[first_symbol][comb][1]\n          })\n        }\n      }\n    }\n    return result;\n  }\n  \n  function init(images) {\n    symbolsSprite = images[0];\n    blurSprite = images[1];\n    winSymbolsSprite = images[2];\n  \n    linesContext.lineWidth = STROKE_WIDTH;\n    linesContext.lineCap = \"round\";\n    linesContext.lineJoin = \"round\";\n    linesContext.shadowOffsetX = 2;\n    linesContext.shadowOffsetY = 2;\n    linesContext.shadowBlur = 5;\n    linesContext.shadowColor = 'rgba(0, 0, 0, 0.25)';\n  \n    for (var i = 0; i < SYMBOLS_COUNT.length; i++) {\n      for (var n = 0; n < SYMBOLS_COUNT[i]; n++) {\n        reelSymbols.push(i)\n      }\n    }\n    shuffleArray(reelSymbols);\n  \n    var symbols = getRandomSymbols();\n    for (var i = 0; i < REELS_COUNT; i++) {\n      drawSymbols(symbols[i], i);\n    }\n  \n    el('#money')[0].textContent = '$' + (money / 100).toFixed(2);\n    el('#lines')[0].textContent = active_lines_count;\n    el('#bet')[0].textContent = active_lines_count + ' x $' + (BETS[bet_index] / 100).toFixed(2);\n  }
</script>
</body>
</html>

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
