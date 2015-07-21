function ajax(url, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) callback && callback(this.response);
  };
  request.send();
}

var url = "js/" + (location.hash.substr(1) || "lessons") + ".js";

ajax(url, function(resp) {
  var script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
  var el = document.querySelector("pre code");
  el.innerText = resp;
  hljs.highlightBlock(el);
});

window.onhashchange = function() {
  location.reload();
};

var link = document.querySelector("[href$='" + (location.hash || "#") + "']");
link && link.classList.add("active");