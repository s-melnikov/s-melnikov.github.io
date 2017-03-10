'use strict'

firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com/'
})

var PER_PAGE = 25

var { h, app, Router } = hyperapp
var db = firebase.database().ref('/v0')
var menu = []
var stories_ref = null
var stories_type = null


// Views

var LayoutView = (model, actions, view) => h('div', { id: 'app' },
  MenuView(model), view(model, actions)
)

var MenuView = (model) => h('header', null,
  h('div', { 'class': 'container' },
    ['Top', 'New', 'Show', 'Ask', 'Job'].map(type => h('a',
        {
          href: '#!/' + type.toLowerCase(),
          'class': type.toLowerCase() === (model.router.params.type || 'top') ?
            'active' : ''
        },
        type
      )
    )
  )
)

var ItemsListView = type => (model, actions) => {
  return h('div',
    { 'class': 'items-list ' + type + '-list' },
    model.stories.map(story => ItemView(story)),
    model.loading ? h('div', { 'class': 'item loader' }, h('span')) : '',
    !model.loading && model.ids.length > model.limit ?
      h('div', {
        'class': 'item more',
        onclick: () => actions.setLimit(model.limit + PER_PAGE)
      }, 'More ...') : ''

  )
}

var ItemView = (item, model, actions) => h('div',
  { 'class': 'item' },
  h('span', { 'class': 'score' }, item.score),
  h('div', { 'class': 'inner' },
    h('div', { 'class': 'title' },
      h('a', { href: item.url, target: '_blank' }, item.title),
      ' ',
      h('a', {
        'class': 'host',
        href: '//' + domain(item.url),
        target: '_blank'
      },
        '(' + domain(item.url) + ')'
      )
    ),
    h('div', { 'class': 'info' },
      'by ',
      h('a', { href: '#' }, item.by),
      ' ',
      fromNow(item.time),
      ' ago',
      item.kids ? ' | ' + item.kids.length + ' comments' : ''
    )
  )
)

// Utils

var parser = document.createElement('a')

function domain(url) {
  parser.href = url
  return parser.hostname
}

function fromNow(time) {
  var between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + ' minutes'
  } else if (between < 86400) {
    return ~~(between / 3600) + ' hours'
  } else {
    return ~~(between / 86400) + ' days'
  }
}

function getStories(ids, cb) {
  var stories = []
  ids.map(id => db.child('item/' + id).once('value', snapshot => {
    stories.push(snapshot.val())
    if (stories.length === ids.length) {
      cb(stories)
    }
  }))
}

// Init

app({
  model: {
    ids: [],
    stories: [],
    limit: null,
    loading: false
  },
  actions: {
    setIds: (model, ids, actions) => {
      getStories(ids.slice(0, model.limit), stories =>
        actions.setStories(stories))
      return { ids }
    },
    setLimit: (model, limit, actions) => {
      getStories(model.ids.slice(0, limit), stories =>
        actions.setStories(stories))
      return { limit, loading: true }
    },
    setStories: (_, stories) => ({ stories, loading: false })
  },
  view: {
    '/:type?': (model, actions) => {
      var type = model.router.params.type || 'top'
      if (stories_type !== type) {
        stories_type = type
        model.limit = PER_PAGE
        model.stories = []
        model.ids = []
        model.loading = true
        if (stories_ref) stories_ref.off()
        stories_ref = db.child(type + 'stories')
        stories_ref.on('value', snapshot =>
          actions.setIds(snapshot.val())
        )
      }
      return LayoutView(model, actions,
        ItemsListView(model.router.params.type || 'top')
      )
    }
  },
  plugins: [Router]
})