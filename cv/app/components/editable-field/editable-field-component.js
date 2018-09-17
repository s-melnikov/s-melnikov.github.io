(() => {

  angular.module('app')
    .component('editableField', {
      templateUrl: 'app/components/editable-field/editable-field-component.html',
      controller: EditableFieldController,
      bindings: {
        fieldValue: '<',
        fieldType: '@?',
        onUpdate: '&'
      }
    });

  function EditableFieldController($scope, $element, $attrs) {

    const ctrl = this;
    ctrl.editMode = false;
    ctrl.handleModeChange = handleModeChange;
    ctrl.reset = reset;
    ctrl.$onInit = $onInit;

    function handleModeChange() {
      if (ctrl.editMode) {
        ctrl.onUpdate({ value: ctrl.fieldValue });
        ctrl.fieldValueCopy = ctrl.fieldValue;
      }
      ctrl.editMode = !ctrl.editMode;
    }

    function reset() {
      ctrl.fieldValue = ctrl.fieldValueCopy;
    }

    function $onInit() {
      ctrl.fieldValueCopy = ctrl.fieldValue;
      if (!ctrl.fieldType) {
        ctrl.fieldType = 'text';
      }
    }
  }

})();