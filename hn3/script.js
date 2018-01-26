!function(e,f,m,l){e.d=(n,c)=>f[n]=c;e.r=n=>{if(m[n])return m[n];if(!f[n])throw`Unknown module "${n}"`;l[n]=1;try{m[n]=f[n](e.r)}finally{l[n]=0};return m[n]}}(this,{},{},{})
d("main", require => {
  let { app } = hyperapp
  app(r("state"), r("actions"), r("view"), document.querySelector("#app"))
})
d("state", r => ({}))
d("actions", r => ({}))
d("view", r => {
  let { h } = hyperapp
  return (state, actions) => h("div", null, "Lorem ipsum")
})
r("main")
