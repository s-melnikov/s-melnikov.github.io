!(exports => {
  let tests = []
  exports.test = (name, test) => {
    tests.push({ name, test })
  }
  exports.run = () => {
    let i = 0, toRun, next
    const done = err => {
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
})(window)

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}