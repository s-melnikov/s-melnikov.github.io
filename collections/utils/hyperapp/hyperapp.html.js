const html = (() => {
  const { h } = hyperapp

  const tags = "header,section,div,h1,h2,h3,h4,h5,p,ul,li,table,th,tr,td,tbody,thead,form,label,input,button,a,span"

  const vnode = tag => (props, ...children) =>
    typeof props === "object" && !Array.isArray(props)
      ? h(tag, props, ...children)
      : h(tag, {}, props)

  return tags.split(",").reduce((res, val) => {
    res[val] = (props, children) => vnode(val)(props, children)
    return res
  }, {})

})()