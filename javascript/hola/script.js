"use strict";

function filter(msgs, rules) {
  rules = rules.map(function(rule) {
    return {
      action: rule.action,
      from: compile(rule.from),
      to: compile(rule.to)
    }
  })
  var
    mids = Object.keys(msgs),
    j = mids.length,
    rulesl = rules.length,
    actions = {}

  while (j--) {
    var mid = mids[j],
      m = msgs[mid],
      a = actions[mid] = [],
      r
    for (var i = 0; i < rulesl; i++) {
      r = rules[i], grep(m, r) && a.push(r.action)
    }
  }
  return actions
}

function grep(m, r) {
  return (!r.from || r.from.test(m.from)) && (!r.to || r.to.test(m.to))
}

function compile(pattern) {
  return pattern && new RegExp('^' + pattern
    .replace(/([.+=^!:${}()|[\]\/\\])/g, '\\$1')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.')
  + '$')
}

var messages = {
  msg1: { from: 'jack@example.com', to: 'jill@example.org'},
  msg2: { from: 'noreply@spam.com', to: 'jill@example.org'},
  msg3: { from: 'boss@work.com', to: 'jack@example.com'}
}

var filters = [
  { from: '*@work.com', action: 'tag work'},
  { from: '*@spam.com', action: 'tag spam'},
  { from: 'jack@example.com', to: 'jill@example.org', action: 'folder jack'},
  { to: 'jill@example.org', action: 'forward to jill@elsewhere.com'}
]

var result = filter(messages, filters)

console.log(result)