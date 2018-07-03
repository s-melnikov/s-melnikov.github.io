(() => {  

  angular.module('app')
    .component('level', {
      templateUrl: 'app/components/level/level-component.html',
      controller: Controller,
      bindings: {
        count: '=',
        selected: '=',
        editMode: '=',
        onUpdate: '&'
      }
    });

  function Controller() {

    const $ctrl = this;
    $ctrl.items = [];
    $ctrl.onClick = onClick;

    Object.defineProperty($ctrl, 'items', {
      get() {
        let items = [];
        for (let i = 0; i < $ctrl.count; i++) {
          items.push(i);
        }
        return items;
      }
    });  

    function onClick(index) {
      $ctrl.onUpdate({ value: index + 1 })
    }
  }

})();