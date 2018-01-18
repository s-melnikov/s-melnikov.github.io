function describe(text, func) {
  let tests = []
  console.log(text)
  func((name, test) => tests.push({ name, test }), (first, second, message) => {
    if (first !== second) throw new Error(message)
  })
  let i = 0, toRun, next
  let done = err => {
    tests.slice(i).map(skippedTest => {
      console.log('-', skippedTest.name)
    })
    console[err ? 'error' : 'log']('\nTests ' +
      (err ? 'failed!\n' + err.stack : 'succeeded!'))
  }
  (next = err => {
    if (toRun) {
      console[err ? 'error' : 'log'](err ? '✘' : '✔', toRun.name)
    }
    if (err || !(toRun = tests[i++])) {
      return done(err)
    }
    try {
      toRun.test.call(toRun.test, next)
    } catch (err) {
      next(err)
    }
  })()
}
