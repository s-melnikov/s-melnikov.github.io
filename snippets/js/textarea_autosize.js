document.querySelector('textarea').addEventListener('keydown', autosize)
function autosize() {
  var el = this;
  setTimeout(function() {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, 0)
}