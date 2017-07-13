'use strict'

firebase.initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com/'
})

var now = Date.now()
var { h, app } = hyperapp
var PER_PAGE = 25
var db = firebase.database().ref('/v0')
var types = ['top', 'new', 'best', 'show', 'ask', 'job']
var state = {
  url: location.hash.slice(2),
  type: 'top',
  limit: PER_PAGE,
  loading: true,
  ids: {},
  stories: {}
}
var actions = {
  setIds: (state, actions, { type, items }) => {
    var ids = state.ids
    ids[type] = items
    if (state.type == type) {
      actions.loading(true)
      getStories(items.slice(0, state.limit), items =>
        actions.setStories({ type, items })
      )
    }
    return { ids }
  },
  setStories: (state, actions, { type, items }) => {
    var stories = state.stories
    stories[type] = items
    actions.loading(false)
    return stories
  },
  setType: (state, actions, type) => {
    actions.loading(true)
    getStories(state.ids[type].slice(0, state.limit), items =>
      actions.setStories({ type, items })
    )
    return { type }
  },
  setLimit: (state, actions, limit) => {
    actions.loading(true)
    getStories(state.ids[state.type].slice(0, limit), items =>
      actions.setStories({ type: state.type, items })
    )
    return { limit }
  },
  loading: (state, actions, loading) => ({ loading })
}
var view = []
var events = {
  init: (state, actions) => types.map(type =>
    db.child(type + 'stories').on('value', snapshot => {
      actions.setIds({ type, items: snapshot.val() })
    })
    addEventListener('hashchange', function() {
      actions.url(location.hash.slice(2))
    })
  )
}
types.map(type => {
  view.push(['/' + type, (state, actions) => {
    if (type != state.type) {
      setTimeout(() => actions.setType(type), 0)
    }
    return LayoutView(
      state,
      actions,
      MenuView,
      ItemsListView
    )
  }])
  state.ids[type] = []
  state.stories[type] = []
})

// Views
var LayoutView = (state, actions, ...childs) => h('div', { id: 'app' },
  childs.map(child => child(state, actions))
)

var MenuView = (state) => h('header', null,
  h('div', { 'class': 'container' },
    types.map(type => h('a', {
        href: '#!/' + type,
        'class': type === state.type ? 'active' : ''
      }, capitalize(type))
    )
  )
)

var ItemsListView = (state, actions) => h('div',
  { 'class': 'items-list ' + state.type + '-list' },
  state.stories[state.type].map(story => {
    if (!story) return false;
    if (state.type === 'user') {
      return UserView(story)
    }
    return StoryView(story)
  }),
  state.loading ? h('div', { 'class': 'item loader' }, h('span')) : '',
  !state.loading && state.ids[state.type].length >
    state.stories[state.type].length ?
    h('div', {
      'class': 'item more',
      onclick: () => actions.setLimit(state.limit + PER_PAGE)
    }, 'More ...') : ''
)


var StoryView = story => h('div',
  {
    'class': 'item item-' + state.type,
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

var UserView = (item, state, actions) => h('div',
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
console.log(view)
app({
  state,
  actions,
  view: view[0][1],
  events
})