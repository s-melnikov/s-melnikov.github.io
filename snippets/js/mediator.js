var mediator = (function() {

  function publish(channel) {
    if (!mediator.channels[channel]) return false
    var args = Array.prototype.slice.call(arguments, 1)
    for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
      var subscription = mediator.channels[channel][i]
      subscription.callback.apply(subscription.context, args)
    }
    return this
  }

  function subscribe(channel, fn) {
    if (!mediator.channels[channel]) mediator.channels[channel] = []
    mediator.channels[channel].push({ context: this, callback: fn })
    return this
  }

  return {
    channels: {},
    publish: publish,
    subscribe: subscribe,
    installTo: function(obj) {
      obj.subscribe = subscribe
      obj.publish = publish
    }
  }

}())

var users = [{
  name: "Tim",
  mails: []
}, {
  name: "John",
  mails: []
}]

mediator.subscribe('getMail', function(mail) {
  users.forEach(function(user) {
    if (mail.to == user.name) user.mails.push(mail)
  })
})

mediator.publish('getMail', { to: "Tim", mail: { text: "Hello Tim!" } })

console.log(JSON.stringify(users[0].mails)) // [{ to: "Tim", mail: { text: "Hello Tim!" }]

//Pub/sub on a centralized mediator
mediator.name = "Tim"

mediator.subscribe('nameChange', function(arg) {
  this.name = arg
})

mediator.publish('nameChange', 'David')

console.log(mediator.name) // David

//Pub/sub via third party mediator
var obj = { name: 'Sam' }
mediator.installTo(obj)

obj.subscribe('nameChange', function(arg) {
  this.name = arg
})
obj.publish('nameChange', 'John')

console.log(obj.name) // John
