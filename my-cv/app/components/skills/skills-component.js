(() => {

  angular.module('app')
    .component('skills', {
      templateUrl: 'app/components/skills/skills-component.html',
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
    $ctrl.addItem = addItem;
    $ctrl.removeItem = removeItem;

    function update(index, key, value) {
      $ctrl.data[index][key] = value;
      $ctrl.onUpdate({ value: $ctrl.data });
    }

    function addItem() {
      $ctrl.data.push({ title: "Type", level: 1 });
    }

    function removeItem(index) {
      $ctrl.data.splice(index, 1);
      $ctrl.onUpdate({ value: $ctrl.data });
    }
  }

})()