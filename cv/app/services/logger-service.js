(() => {

  angular
    .module('app')
    .factory('logger', logger);

  function logger() {

    const factory = {
      info,
      warn,
      error
    }

    return factory;   

    function info(text, ...rest) {
      console.info('%cINFO %s', 'color:#777777', text, ...rest);
    }

    function warn(text, ...rest) {
      console.info('%cWARN %s', 'color:#FF5722', text, ...rest);
    }

    function error(text, ...rest) {
      console.info('%cERROR %s', 'color:#dd1144', text, ...rest);
    }
  }

})();