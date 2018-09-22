(() => {

  const DATA_FILE_NAME = 'MOCK_DATA.json';

  angular
    .module('app')
    .factory('rest-service', restService);

  restService.$inject = ['$http', 'logger'];

  function restService($http, logger) {  

    const factory = {
      getAppData,
      updateData
    }

    return factory

    function getAppData() {
      logger.info('rest-service:getAppData()');
      return $http.get(DATA_FILE_NAME)
        .then(responseHandler)
        .catch(errorHandler);
    }

    function responseHandler({ data }) {
      logger.info('rest-service:responseHandler()', data);
      return data;
    }

    function errorHandler({ statusText }) {
      logger.error("rest-service:errorHandler()", statusText);
      return false;
    }

    function updateData(data) {
      logger.info('rest-service:updateData()', data);
      angular.forEach(data, (value, prop) => {
        logger.info(`Post request to '/api/${prop}/' with data:`, value);
        // save data to server
        // $http.post(`/api/${prop}/`, value);
      });      
    }
  }

})();