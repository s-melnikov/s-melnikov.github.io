!function(exports){
  exports.describe = (name, func) => {
    let tests = []
    console.group(name)
    func((name, test) => tests.push({ name, test }), (first, second, message) => {
      if (first !== second) throw new Error(message)
    })
    let i = 0, toRun, next
    (next = err => {
      if (toRun) {
        console.log("%c%s", `color:#${err ? "f00" : "0f0"}`, err ? '✘' : '✔', toRun.name)
      }
      if (err || !(toRun = tests[i++])) {
        console.groupEnd(name)
        tests.slice(i).map(skippedTest => {
          console.log('-', skippedTest.name)
        })
        console.log("%c%s", `color:#${err ? "f00" : "0f0"}`,
          `Tests ${err ? `failed!\n${err.stack}` : "succeeded!"}`)
        return;
      }
      try {
        toRun.test(next)
      } catch (err) {
        next(err)
      }
    })()
  }
}(this);
