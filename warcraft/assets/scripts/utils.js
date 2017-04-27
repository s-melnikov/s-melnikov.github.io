define("utils", [], () => {
  "use strict"

  // let loader = (map, cb) => {
  //   let c = 0, l = 0, img
  //   for (let p in map) {
  //   c++
  //   img = new Image()
  //   img.onload = () => {
  //     if (++l == c) cb(map)
  //   }
  //   img.src = map[p]
  //   map[p] = img
  //   }
  // }
  //
  // class Game {
  //   constructor() {
  //   this.setScene(IntroScene)
  //   this.initInput()
  //   this.startLoop()
  //   }
  //
  //   initInput() {
  //   this.keys = {}
  //   document.addEventListener("keydown", event => this.keys[event.which] = true)
  //   document.addEventListener("keyup", event => this.keys[event.which] = false)
  //   }
  //
  //   setScene(Scene) {
  //   this.activeScene = new Scene(this)
  //   }
  //
  //   update(delta) {
  //   this.activeScene.update(delta)
  //   }
  //
  //   render(delta) {
  //   this.activeScene.render(delta, this.context, this.canvas)
  //   }
  // }
  //
  //
  // class Scene {
  //   constructor(canvas) {
  //   this.canvas = canvas
  //   this.context = canvas.getContext("2d")
  //   this.width = canvas.width
  //   this.height = canvas.height
  //   this.children = []
  //
  //   this.last = performance.now()
  //   this.delta = 0
  //   this.fps = 60
  //   this.step = 1 / this.fps
  //
  //   }
  //   appendChild(child) {
  //   this.children.push(child)
  //   }
  //   run() {
  //   for (let key in Scene.listeners) {
  //     this.canvas.addEventListener(key, event => {
  //     if (Scene.listeners[key]) {
  //       Scene.listeners[key].map(listener => listener(event))
  //     }
  //     })
  //   }
  //   this.frame()
  //   }
  //   update(step) {
  //   }
  //   render() {
  //   this.context.clearRect(0, 0, this.width, this.height)
  //   this.children.map(child => {
  //     this.context.putImageData(
  //     child.draw(),
  //     child.x,
  //     child.y
  //     )
  //   })
  //   }
  //   frame() {
  //   let now = performance.now()
  //   this.delta = this.delta + Math.min(1, (now - this.last) / 1000)
  //   while (this.delta > this.step) {
  //     this.delta = this.delta - this.step
  //     this.update(this.step)
  //   }
  //   this.render()
  //   this.last = now
  //   requestAnimationFrame(this.frame.bind(this));
  //   }
  // }
  // Scene.METER = 100
  // Scene.listeners = {}
  //
  // Scene.addEventListener = (name, callback) => {
  //   if (!Scene.listeners[name]) Scene.listeners[name] = []
  //   Scene.listeners[name].push(callback)
  // }
  //
  // class Sprite {
  //   constructor(image, x = 0, y = 0, width = 0, height = 0) {
  //   this.canvas = document.createElement("canvas")
  //   this.context = this.canvas.getContext("2d")
  //   this.image = image
  //   this.imageX = x
  //   this.imageY = y
  //   this.imageWidth = width
  //   this.imageHeight = height
  //   this.x = 0
  //   this.y = 0
  //   this.scale = 1
  //   this.width = width
  //   this.height = height
  //   }
  //   draw() {
  //   if (!this._cache) this.update()
  //   return this._cache
  //   }
  //   update() {
  //   this.canvas.width = this.imageWidth * this.scale
  //   this.canvas.height = this.imageHeight * this.scale
  //   this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height)
  //   this._cache = this.context.getImageData(0, 0, this.width, this.height)
  //   }
  //   addEventListener(name, callback) {
  //   Scene.addEventListener(name, callback)
  //   }
  // }
  //
  // let scene = new Scene(document.querySelector("#scene"))
  //
  // loader({ first: "XUY5nQp.png" }, images => {
  //   let map = new Sprite(images.first, 0, 0, images.first.naturalWidth, images.first.naturalHeight)
  //
  //   map.scale = 2
  //
  //   map.addEventListener("mousedown", event => {
  //   map.dragstart = { x: event.clientX, y: event.clientY }
  //   map.startposition = { x: map.x, y: map.y }
  //   })
  //   map.addEventListener("mouseup", event => {
  //   map.dragstart = null
  //   map.startposition = null
  //   })
  //   map.addEventListener("mousemove", event => {
  //   if (map.dragstart) {
  //     map.x = Math.max(
  //     Math.min(map.startposition.x + event.clientX - map.dragstart.x, 0),
  //     scene.width - map.width
  //     )
  //     map.y = Math.max(
  //     Math.min(map.startposition.y + event.clientY - map.dragstart.y, 0),
  //     scene.height - map.height
  //     )
  //   }
  //   })
  //
  //   scene.appendChild(map)
  //   scene.run()
  // })


  // 'use strict'
  // let
  //   canvas = document.createElement('canvas'),
  //   canvas1 = document.createElement('canvas'),
  //   ctx = canvas.getContext('2d'),
  //   ctx1 = canvas1.getContext('2d'),
  //   stepX = 16,
  //   stepY = 16
  //
  // canvas1.width = 5000
  // canvas1.height = 17 * 7
  // document.body.appendChild(canvas1)
  //

  // let compared = []
  // loader({
  //   map1: '9QK6XYh.png',
  //   map2: '48dkJuH.png',
  //   map3: 'mWj9T4k.png',
  //   map4: 'wrf7W1d.png',
  //   map5: 'XUY5nQp.png',
  //   map6: 'XZpmnML.png',
  //   map7: 'yDZi2Pt.png',
  // }, images => {
  //   Object.keys(images).map((key, i) => drawUniq(images[key], i))
  //   console.log(compared)
  // })
  //
  // let drawUniq = (img, number) => {
  //   let
  //   temp = [],
  //   uniq = []
  //   canvas.width = img.naturalWidth
  //   canvas.height = img.naturalHeight
  //   ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
  //   for (let y = 0; y < img.naturalHeight; y += stepY) {
  //   for (let x = 0; x < img.naturalWidth; x += stepX) {
  //     let data = ctx.getImageData(x, y, stepX, stepY),
  //     corr = 0
  //     for (let i = 0; i < uniq.length; i++) {
  //     corr = Math.max(compare(uniq[i], data), corr)
  //     }
  //     if (corr < 70) uniq.push(data)
  //     // if (temp.indexOf(hash) === -1) {
  //     //   data._r = 0
  //     //   data._g = 0
  //     //   data._b = 0
  //     //   for (let l = 0; l < data.data.length; l += 4) {
  //     //   data._r += data.data[l]
  //     //   data._g += data.data[l + 1]
  //     //   data._b += data.data[l + 2]
  //     //   }
  //     //   uniq.push(data)
  //     //   temp.push(hash)
  //     // }
  //   }
  //   }
  //
  //   uniq.sort((a, b) => {
  //   if (a._r < b._r) return -1
  //   if (a._r > b._r) return 1
  //   if (a._g < b._g) return -1
  //   if (a._g > b._g) return 1
  //   if (a._b < b._b) return -1
  //   if (a._b > b._b) return 1
  //   return 0
  //   })
  //
  //   for (let i = 0; i < uniq.length; i++) {
  //   ctx1.putImageData(uniq[i], i * (stepX + 1), number * 17)
  //   }
  //   xxx
  // }
  //
  // let compare = (a, b) => {
  //   let i = 0, c = 0, ln = a.data.length
  //   a = a.data
  //   b = b.data
  //   for (; i < ln; i += 4) {
  //   if (a[i] === b[i] && a[i + 1] === b[i + 1] && a[i + 2] === b[i + 2]) {
  //     c++
  //   }
  //   }
  //   return Math.round(c / ln * 400)
  // }
  })