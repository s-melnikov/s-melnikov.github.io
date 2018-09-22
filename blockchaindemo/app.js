let { app, h } = hyperapp
let blockchain = new Blockchain()

let blockView = (block, i, state, actions) => {
  let previousBlock = i === 0 ? new Block(-1, "0", 0, 0, "0", 0) :  state.blocks[i - 1]
  let isValid = blockchain.isValidNextBlock(block, previousBlock)  
  return h("div", {
      class: "block"
    },
    h("div", { class: "block-data"},
      h("input", {
        type: "text",
        oninput: event =>
          actions.blockOnInput({ block, value: event.target.value }),
        value: block.data,
        placeholder: "Block data"
      })
    ),
    h("div", { class: "block-hashes" },
      h("div", null, 
        h("span", { class: "label" }, "previous hash:"),
        h("span", { class: "block-hash-previous" }, block.previousHash),
      ),
      h("div", null, 
        h("span", { class: "label" }, "hash:"),
        h("span", { 
          class: "block-hash" + (isValid ? "" : " invalid")
        }, block.hash)
      )
    ),
    h("div", { class: "block-meta" },
      h("span", { class: "block-title" },
        block.index > 0 ? "Block #" + block.index : "Genesis block"),
      h("span", { class: "block-timestamp" },
        new Date(block.timestamp).toLocaleString()),
      h("span", { class: "block-nonce" }, "nonce: " + block.nonce),
      isValid ? null : h("span", { 
        class: "link",
        onclick: () => { actions.recalHash(block) }
      }, "recalculate hash")
    )
  )
}

let layoutView = (state, actions) => {
  return h("div", { class: "container" },
    h("h1", null, "Blockchain"),
    h("div", { class: "blocks" },
      state.blocks.map((block, i) => blockView(block, i, state, actions)),
      h("div", { class: "block"},
        h("form", { onsubmit: actions.addBlockFormSubmit },
          h("input", { type: "text", placeholder: "Enter data" }),
          h("button", null, "Add new block"),
        )
      )
    )
  )
}
let state = {
  blocks: blockchain.get()
}
let actions = {
  addBlockFormSubmit: event => state => {
    event.preventDefault()
    let value = event.target.elements[0].value
    if (value) {
      blockchain.mine(value)
      setTimeout(() => { event.target.elements[0].value = "" }, 0)
      return { blocks: blockchain.get() }
    }    
  },
  blockOnInput: ({ block, value }) => state => {
    block.data = value
    return { blocks: state.blocks }
  },
  recalHash: block => state => {
    let newBlock = blockchain.recalculateBlockHash(block)
    let nextIndex = state.blocks.indexOf(block) + 1
    block.hash = newBlock.hash
    block.nonce = newBlock.nonce
    if (state.blocks[nextIndex]) {
      state.blocks[nextIndex].previousHash = newBlock.hash
    }    
    return { blocks: state.blocks }
  }
}
app(state, actions, layoutView, document.body)