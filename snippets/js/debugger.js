(function() {
  (function(f) {
    (function a() {
      try {
        function b(i) {
          if (('' + (i / i)).length !== 1 || i % 20 === 0) {
            (function() {
              'use strict';
              eval('debugger');
            })();
          } else {
            debugger;
          }
          b(++i);
        }
        b(0);
      } catch(e) {
        f.setTimeout(a, 1000)
      }
    })()
  })(document.body.appendChild(document.createElement('frame')).contentWindow);
})()
