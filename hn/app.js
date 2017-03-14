'use strict'

firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com/'
})

var PER_PAGE = 25
var { h, app, Router } = hyperapp
var db = firebase.database().ref('/v0')
var menu = []


// Views

var LayoutView = (model, actions, view, type) => h('div', { id: 'app' },
  MenuView(model, actions, type), view(model, actions, type)
)

var MenuView = (model, actions, type) => h('header', null,
  h('div', { 'class': 'container' },
    ['Top', 'New', 'Best', 'Show', 'Ask', 'Job'].map(t => h('a',
        {
          href: '#!/' + t.toLowerCase(),
          'class': t.toLowerCase() === type ? 'active' : ''
        },
        t
      )
    )
  )
)

var ItemsListView = (model, actions, type) => h('div',
  { 'class': 'items-list ' + type + '-list' },
  model.stories.map(story => {
    if (!story) return false;
    if (model.type === 'user') {
      return UserView(story)
    }
    return StoryView(story, type)
  }),
  model.loading ? h('div', { 'class': 'item loader' }, h('span')) : '',
  !model.loading && model.ids.length > model.limit ?
    h('div', {
      'class': 'item more',
      onclick: () => actions.setLimit(model.limit + PER_PAGE)
    }, 'More ...') : ''
)


var StoryView = (item, type) => h('div',
  {
    'class': 'item item-' + type,
    onclick: () => console.log(item)
  },
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
      h('a', { href: '#!/user/' + item.by }, item.by),
      ' ',
      fromNow(item.time),
      ' ago | ',
      h('a', { href: '#' }, item.descendants ? (item.descendants + ' comments') : 'discuss')
    )
  )
)

var UserView = (item, model, actions) => h('div',
  { 'class': 'item item-user' },
  h('div', { 'class': 'user-id' }, item.id),
  h('table', null,
    h('tbody', null,
      h('tr', null,
        h('td', null, 'Karma:'),
        h('td', null, item.karma)
      ),
      h('tr', null,
        h('td', null, 'Created:'),
        h('td', null, new Date(item.created * 1000).toLocaleString())
      ),
      h('tr', null,
        h('td', null, 'About:'),
        h('td', { innerHTML: item.about || '[no info]' })
      )
    )
  )
)

var ErrorView = () => h('div', { 'class': 'items-list' },
  h('div', { 'class': 'item text-centered' }, 'Page not found!')
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

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]
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
    type: null,
    ref: null,
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
      if (model.type !== type) {
        model.type = type
        model.limit = PER_PAGE
        model.stories = []
        model.ids = []
        model.loading = true
        if (model.ref) model.ref.off()
        model.ref = db.child(type + 'stories')
        model.ref.on('value', snapshot =>
          actions.setIds(snapshot.val())
        )
      }
      return LayoutView(model, actions, ItemsListView, type)
    },
    '/user/:id': (model, actions) => {
      var type = 'user'
      if (model.type !== type) {
        model.type = type
        model.limit = PER_PAGE
        model.stories = []
        model.ids = []
        model.loading = true
        if (model.ref) model.ref.off()
        db.child('user/' + model.router.params.id).once('value', snapshot => {
          var user = snapshot.val()
          getStories(user.submitted || [], submitted => {
            user.submitted = submitted
            actions.setStories([user])
          })
        })
      }
      return LayoutView(model, actions, ItemsListView, type)
    },
    '*': (model, actions) => LayoutView(model, actions, ErrorView)
  },
  plugins: [Router]
})