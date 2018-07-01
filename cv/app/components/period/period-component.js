(() => {

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

  angular.module('app')
    .component('period', {
      templateUrl: 'app/components/period/period-component.html',
      controller: Controller,
      bindings: {
        data: '=',
        isEditing: '=',
        onUpdate: '&'
      }
    });

  function Controller() {

    const $ctrl = this;
    const currentYear = (new Date()).getFullYear();
    $ctrl.getMonthName = getMonthName;
    $ctrl.toggleEditMode = toggleEditMode;
    $ctrl.onCurrentChange = onCurrentChange;
    $ctrl.endCurrent = false;
    $ctrl.monthes = MONTH_NAMES;
    $ctrl.years = [];
    for (let i = currentYear; i > currentYear - 50; i--) {
      $ctrl.years.push(i);
    }

    function getMonthName(index) {
      return MONTH_NAMES[Number(index)];
    }

    function toggleEditMode() {
      if ($ctrl.editMode) {
        $ctrl.onUpdate({ value: $ctrl.data });
      }
      $ctrl.editMode = !$ctrl.editMode;
    }

    function onCurrentChange() {
      if ($ctrl.endCurrent) {
        $ctrl.data.end = null;
      } else {
        $ctrl.data.end = {
          month: 0,
          year: 0
        };
      }
    }
  }

})();