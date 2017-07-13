define("sounds", [], () => {
  "use strict"

  class Sounds {

    constructor(sources) {
      this.sources = sources
    }

    play(name) {
      if (this.sources[name]) this.sources[name].play()
    }

    pause(name) {
      if (name) {
        if (this.sources[name]) {
          this.sources[name].pause()
        }
      } else {
        for (let name in this.sources) {
          this.sources[name].pause()
        }
      }
    }
  }

  return Sounds
})