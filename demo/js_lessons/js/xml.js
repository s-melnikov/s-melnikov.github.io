function xml(params) {
  var doc;
  function node(parent, params) {
    if (!doc) {
      doc = document.implementation.createDocument("", params.name, null);
      el = doc.documentElement;      
    } else {
      var el = doc.createElement(params.name); 
      parent.appendChild(el);
    }     
    for (var prop in (params.attrs || {})) {
      el.setAttribute(prop, params.attrs[prop]);
    }
    for (var i = 0, ln = (params.childs || []).length; i < ln; i++) {
      node(el, params.childs[i]);
    }
    !params.childs && params.text && el.appendChild(doc.createTextNode(params.text));
  }
  node(null, params);
  return doc;
}

var xml = xml({
  name: "server",
  attrs: { forsearch: "999-999-999", command: "bet", status: "bong" },
  childs: [
    { name: "playinfo", attrs: { minutes: "772", win: "33.800000" }}
  ]
});

console.log(xml)