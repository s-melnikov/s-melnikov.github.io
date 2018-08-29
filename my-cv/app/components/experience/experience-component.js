(() => {

  angular.module('app')
    .component('experience', {
      templateUrl: 'app/components/experience/experience-component.html',
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
      let date = new Date();
      let month = date.getMonth();
      let year = date.getFullYear();
      $ctrl.data.push({ 
        title: "Company name", 
        position: "Position",
        period: {
          start: { month, year },
          end: { month, year }
        }
      });
    }

    function removeItem(index) {
      $ctrl.data.splice(index, 1);
      $ctrl.onUpdate({ value: $ctrl.data });
    }
  }

})()