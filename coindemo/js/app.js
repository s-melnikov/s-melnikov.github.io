let { h, app } = hyperapp

let blockchain = new Blockchain()

let recipients = [
  { "id": 1, "name": "Jose Punch" },
  { "id": 2, "name": "Roddie Foxworthy" },
  { "id": 3, "name": "Dennie Caesmans" },
  { "id": 4, "name": "Malory Pablo" },
  { "id": 5, "name": "Trevor Luttgert" },
  { "id": 6, "name": "Emmaline Ockendon" },
  { "id": 7, "name": "Ashly Stevings" },
  { "id": 8, "name": "Amber Roxbrough" },
  { "id": 9, "name": "Ninnette Sarfati" },
  { "id": 10, "name": "Leonelle Ficken" }
]

recipients.map(recipient => {
  recipient.inputs = []
})

var state = {
  recipients,
  current: recipients[0]
}     

var actions = {}   

app(state, actions, Layout, document.body)

function Layout(state, actions) {
  return h("div", { class: "container" },           
    h("div", { class: "row" },
      h("div", { class: "col" },
        h("div", { class: "card card-wallet"},
          h("div", { class: "title" }, "Wallet"),
          h("div", { class: "name" }, "User name: " + state.current.name),
          h("div", { class: "balance" }, "Balance: " + money(0)),
          h("div", { class: "transaction" },
            h("label", null, 
              h("span", null, "Recipient"),
              h("input", { type: "text", list: "recipients-list" }),
              h("datalist", { id: "recipients-list" },
                state.recipients.map(item => 
                  item !== state.current ? h("option", { value: item.name }) : null)
              )
            )
          ),
          h("div", { class: "row" },
            h("div", { class: "col-3" },
              h("label", null,
                h("span", null, "Amount"),
                h("input", { type: "text" })
              )                
            ),
            h("div", { class: "col" },
              h("label", null, 
                h("span", null, "Fee"),
                h("input", { type: "text" })
              ) 
            )
          ),
          h("div", null, "Total: " + money(0)),
          h("label", null, 
            h("span", null, "Funds"),
            h("select", {}, 
              state.current.inputs.map(input => 
                h("option", { value: input.id }, money(input.value))
              ) 
            )
          ),
          h("div", null, "Total: " + money(0))
        )
      ),
      h("div", { class: "col-5" })
    )    
  )
}