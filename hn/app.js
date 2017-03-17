'use strict'

firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com/'
})

var now = Date.now()
var { h, app, Router } = hyperapp
var PER_PAGE = 25
var db = firebase.database().ref('/v0')
var types = ['top', 'new', 'best', 'show', 'ask', 'job']
var model = {
  type: 'top',
  limit: PER_PAGE,
  loading: true,
  ids: {},
  stories: {}
}
var actions = {
  setIds: (model, { type, items }, actions) => {
    var ids = model.ids
    ids[type] = items
    if (model.type == type) {
      actions.loading(true)
      getStories(items.slice(0, model.limit), items =>
        actions.setStories({ type, items })
      )
    }
    return { ids }
  },
  setStories: (model, { type, items }, actions) => {
    var stories = model.stories
    stories[type] = items
    actions.loading(false)
    return stories
  },
  setType: (model, type, actions) => {
    actions.loading(true)
    getStories(model.ids[type].slice(0, model.limit), items =>
      actions.setStories({ type, items })
    )
    return { type }
  },
  setLimit: (model, limit, actions) => {
    actions.loading(true)
    getStories(model.ids[model.type].slice(0, limit), items =>
      actions.setStories({ type: model.type, items })
    )
    return { limit }
  },
  loading: (_, loading) => ({ loading })
}
var view = {}
var subscriptions = [
  (model, actions) => types.map(type =>
    db.child(type + 'stories').on('value', snapshot => {
      actions.setIds({ type, items: snapshot.val() })
    })
  )
]
types.map(type => {
  view['/' + type] = (model, actions) => {
    if (type != model.type) {
      setTimeout(() => actions.setType(type), 0)
    }
    return LayoutView(
      model,
      actions,
      MenuView,
      ItemsListView
    )
  }
  model.ids[type] = []
  model.stories[type] = []
})

// Views
var LayoutView = (model, actions, ...childs) => h('div', { id: 'app' },
  childs.map(child => child(model, actions))
)

var MenuView = (model) => h('header', null,
  h('div', { 'class': 'container' },
    types.map(type => h('a', {
        href: '#!/' + type,
        'class': type === model.type ? 'active' : ''
      }, capitalize(type))
    )
  )
)

var ItemsListView = (model, actions) => h('div',
  { 'class': 'items-list ' + model.type + '-list' },
  model.stories[model.type].map(story => {
    if (!story) return false;
    if (model.type === 'user') {
      return UserView(story)
    }
    return StoryView(story)
  }),
  model.loading ? h('div', { 'class': 'item loader' }, h('span')) : '',
  !model.loading && model.ids[model.type].length >
    model.stories[model.type].length ?
    h('div', {
      'class': 'item more',
      onclick: () => actions.setLimit(model.limit + PER_PAGE)
    }, 'More ...') : ''
)


var StoryView = story => h('div',
  {
    'class': 'item item-' + model.type,
    onclick: () => console.log(story)
  },
  h('span', { 'class': 'score' }, story.score),
  h('div', { 'class': 'inner' },
    h('div', { 'class': 'title' },
      h('a', { href: story.url, target: '_blank' }, story.title),
      ' ',
      h('a', {
          'class': 'host',
          href: '//' + domain(story.url),
          target: '_blank'
        },
        '(' + domain(story.url) + ')'
      )
    ),
    h('div', { 'class': 'info' },
      'by ',
      h('a', { href: '#!/user/' + story.by }, story.by),
      ' ',
      fromNow(story.time),
      ' ago | ',
      h('a', { href: '#' }, story.descendants ? (story.descendants + ' comments') : 'discuss')
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
      ),
      h('tr', null,
        h('td'),
        h('td', null,
          h('a', { href: '#!/user/submissions/' + item.id }, 'submissions'),
          ' | ',
          h('a', { href: '#!/user/comments/' + item.id }, 'comments')
        )
      )
    )
  )
)

var ErrorView = () => h('div', { 'class': 'items-list' },
  h('div', { 'class': 'item text-centered' }, 'Page not found!')
)

// Utils

var parser = document.createElement('a')

var domain = url => (parser.href = url) && parser.hostname

var fromNow = (time, between) => {
  between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return ~~(between / 60) + ' minutes'
  } else if (between < 86400) {
    return ~~(between / 3600) + ' hours'
  } else {
    return ~~(between / 86400) + ' days'
  }
}

var capitalize = str => str[0].toUpperCase() + str.slice(1)

var getStories = (items, callback, result = []) => {
  items.map(item => db.child('item/' + item).once('value', snapshot => {
    result.push(snapshot.val())
    if (result.length === items.length) {
      callback(result)
    }
  }))
}

// Init

app({
  model,
  actions,
  view,
  subscriptions,
  plugins: [Router]
})


/*'/user/:id': (model, actions) => {
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
'/user/submissions/:id': (model, actions) => {
  var type = 'user-submissions'
  if (model.type !== type) {
    model.type = type
    model.limit = PER_PAGE
    model.stories = []
    model.ids = []
    model.loading = true
    if (model.ref) model.ref.off()
    db.child('user/' + model.router.params.id).once('value', snapshot =>
      getStories(
        snapshot.val().submitted,
        items => actions.setStories(
          items.filter(i => i.type === 'story' && !i.deleted)
        )
      )
    )
  }
  return LayoutView(model, actions, ItemsListView, type)
},
'*': (model, actions) => LayoutView(model, actions, ErrorView)*/