define("loader", [], () => {
  "use strict"

  class Loader {
    load() {

    }
    sound(sources, callback) {
      let length = Object.keys(sources).length, i = 0
      for (let name in sources) {
        let audio = new Audio(sources[name])
        audio.oncanplaythrough = () => {
          if (++i == length) callback(sources)
        }
        sources[name] = audio
      }
    }
  }

  return Loader
})