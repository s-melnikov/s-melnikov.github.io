'use strict'

const fs = require('fs')
const mustache = require('./.app/mustache.min')
const marked = require('./.app/marked.min')

function each(t, cb) { for (var p in t) cb(t[p], p) }

var S = {

  settings: {
    meta: {

    },
    contentTypes: {
      post: 'posts',
      page: 'pages'
    }
  },

  content: {},
  views: {},

  prepareDirs: function(type, dir) {

    try {
      fs.accessSync(dir, fs.F_OK)
      var files = fs.readdirSync(dir)
      if (files.length) {
        files.map(function(file) {
          fs.unlink(dir + '/' + file)
        })
      }
    } catch(e) {
      fs.mkdirSync(dir)
    }
  },

  renderSiteStructure: function() {

    var ready = {}

    for (var type in S.settings.contentTypes) {
      ready[type] = false
      S.prepareDirs(S.settings.contentTypes[type], type, ready, S.createFiles)
    }
  },

  loadViews: function() {

    var files = fs.readdirSync('.src/views')

    if (!files.length) throw Error('Error code #3')

    files.map(function(file) {
      if (file.endsWith('.html')) {
        var paht = '.src/views/' + file

        var content = fs.readFileSync(paht, {encoding: 'utf-8'})
        var name = file.replace(/\.html$/i, '').toLowerCase()
        S.views[name] = content
      }
    })
  },

  getFiles: function(type, dir) {

    var filenames = fs.readdirSync('.src/' + dir)

    S.content[type] = []

    if (!filenames.length) throw Error('Error code #1')

    filenames.map(function(filename) {

      if (!filename.endsWith('.md')) return false;

      var file = {},
        link = '.src/' + dir + '/' + filename,
        fileContent = fs.readFileSync(link, {encoding: 'utf-8'}),
        parsedContent = fileContent.split('---'),
        fileInfo = parsedContent[1].split('\n')

      if (type === 'post') {
        file.date = new Date(filename.substring(0, 10))
        filename = filename.substring(0, 11)
      }

      file.name = filename.replace(/\.md$/i, '').toLowerCase()
      file.info = {}
      fileInfo.map(function(val, key) {
        val = val.replace(/^\s+|\s+$/g, '').trim()

        if (val.length) {
          val = val.split(':')
          var key = val.shift().trim()
          file.info[key] = val.join(':').trim()
        }
      })

      file.contentRaw = parsedContent[2]
      file.content = marked(parsedContent[2])

      S.content[type].push(file)
    })
  },

  init: function() {

    each(S.settings.contentTypes, function(dir, type) {
      S.getFiles(type, dir)
    })

    S.loadViews()

    each(S.settings.contentTypes, function(dir, type) {
      S.prepareDirs(type, dir)
    })
  }
}

S.init()