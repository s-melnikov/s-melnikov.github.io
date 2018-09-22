(() => {
  let tests = []
  this.test = (name, test) => {
    tests.push({ name, test })
  }
  this.run = () => {
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
})()
const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

test('test 1 + 1 = 2', done => {
  assert(1 + 1 == 2)
  done()
})

test('test 1 + 2 = 3', done => {
  assert(1 + 2 == 3)
  done()
})

test('test 2 + 2 = 4', done => {
  assert(2 + 2 == 4)
  done()
})

run()