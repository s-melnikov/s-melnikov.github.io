// no easing, no acceleration
function linear (t) { return t }

// accelerating from zero velocity
function easeInQuad (t) { return t*t }

// decelerating to zero velocity
function easeOutQuad (t) { return t*(2-t) }

// acceleration until halfway, then deceleration
function easeInOutQuad (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }

// accelerating from zero velocity
function easeInCubic (t) { return t*t*t }

// decelerating to zero velocity
function easeOutCubic (t) { return (--t)*t*t+1 }

// acceleration until halfway, then deceleration
function easeInOutCubic (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }

// accelerating from zero velocity
function easeInQuart (t) { return t*t*t*t }

// decelerating to zero velocity
function easeOutQuart (t) { return 1-(--t)*t*t*t }

// acceleration until halfway, then deceleration
function easeInOutQuart (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }

// accelerating from zero velocity
function easeInQuint (t) { return t*t*t*t*t }

// decelerating to zero velocity
function easeOutQuint (t) { return 1+(--t)*t*t*t*t }

// acceleration until halfway, then deceleration
function easeInOutQuint (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }