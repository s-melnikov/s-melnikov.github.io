var VAR_MATCH_REGEX = /\{\{\s*(.*?)\s*\}\}/g

function _val2str (value) {
  switch (typeof value) {
  case 'string':
  case 'number':
  case 'boolean':
    return value;
  case 'object':
    try {
      return value === null ? '' : JSON.stringify(value)
    } catch (jsonError) {
      return '{...}'
    }
  default:
    return ''
  }
}
function _resolver(scope, path, pathIndex = 0) {
  if (typeof scope !== 'object' || scope === null || scope === undefined) return ''
  var name = path[pathIndex], value = scope[name]
  if (pathIndex === path.length - 1) return value
  return _resolver(value, path, ++pathIndex)
}
function defaultResolver(name, view) {
  return _resolver(view, name.split('.'))
}
function render (template, view, resolver) {
  view = view || {}
  resolver = resolver || defaultResolver
  if (typeof template !== 'string') return template
  return template.replace(VAR_MATCH_REGEX, function (match, name) {
    try {
      return _val2str(resolver(name, view))
    } catch (e) {
      return _val2str(defaultResolver(name, view))
    }
  })
}

function compile(template, resolver) {
  return function compiler(view) {
    return render(template, view, resolver)
  }
}

console.log(
  render(
    'Search for {{first}} {{ last }} songs!\nHe was {{age}} years old!',
    {
      first: 'Michael',
      last: 'Jackson'
    }
  )
)

console.log(
  render(
    'I like {{length}} fruits: {{0}}, {{1}} and {{2}}.',
    ['orange', 'apple', 'lemon']
  )
)

console.log(
  render(
    '{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, {{children.1.first}} and {{children.2.first}}',
    {
      first: 'Michael',
      last: 'Jackson',
      children: [
        {
          first: 'Paris-Michael',
          middle: 'Katherine',
        },
        {
          first: 'Prince',
          middle: 'Michael',
          prefix: 'II'
        },
        {
          first: 'Michael',
          middle: 'Joseph',
          prefix: 'Jr.'
        }
      ]
    }
  )
)
