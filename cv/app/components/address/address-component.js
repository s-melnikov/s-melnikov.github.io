(() => {

  angular.module('app')
    .component('address', {
      templateUrl: 'app/components/address/address-component.html',
      controller: Controller,
      bindings: {
        data: '=',
        isEditing: '=',
        onUpdate: '&'
      }
    });

  function Controller() {

    const $ctrl = this;

    $ctrl.update = update;

    function update(data) {
      $ctrl.onUpdate({ 
        value: Object.assign($ctrl.data, data)
      });
    }
  }

})()