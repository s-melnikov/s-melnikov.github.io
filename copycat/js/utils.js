define("utils", [], () => {

  var Utils = {}

  Utils.morceler = function(tableau, largeur) {
    var result = []
    for (var i = 0; i < tableau.length; i += largeur)
      result.push(tableau.slice(i, i + largeur))
    return result
  }

  Utils.linearTween = function(currentTime, debut, degreduChangement, duration) {
    return degreduChangement * currentTime / duration + debut
  }

  Utils.easeInOutQuart = function(t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t * t * t + b
    t -= 2
    return -c / 2 * (t * t * t * t - 2) + b
  }

  return Utils

})