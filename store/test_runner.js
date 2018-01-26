function describe(name, func) {
  let tests = []
  console.group("[", name, "]")
  func((name, test) => tests.push({ name, test }), (first, second, message) => {
    if (first !== second) throw new Error(message)
  })
  let i = 0, toRun, next
  (next = err => {
    if (toRun) {
      console[err ? 'error' : 'log'](err ? '✘' : '✔', toRun.name)
    }
    if (err || !(toRun = tests[i++])) {
      console.groupEnd(name)
      tests.slice(i).map(skippedTest => {
        console.log('-', skippedTest.name)
      })
      return console[err ? 'error' : 'log']('\nTests ' +
        (err ? 'failed!\n' + err.stack : 'succeeded!'))
    }
    try {
      toRun.test(next)
    } catch (err) {
      next(err)
    }
  })()
}
