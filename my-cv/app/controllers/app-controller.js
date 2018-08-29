(() => {  

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['rest-service', 'logger'];

  function AppController(rest, log) {

    const ctrl = this;
    ctrl.isInited = false;
    ctrl.isEditing = false;
    ctrl.toggleEditing = toggleEditing;
    ctrl.updateData = updateData;

    init();

    function init() {    
      rest.getAppData()
        .then(setAppData);
    }

    function setAppData(data) {
      if (data) {
        ctrl.isInited = true;
        Object.assign(ctrl, data);
      }      
    }

    function updateData(data) {
      rest.updateData(data)
    }

    function toggleEditing() {
      ctrl.isEditing = !ctrl.isEditing;
    }
  }

})();