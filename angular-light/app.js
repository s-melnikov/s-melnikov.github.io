function TodoCtrl($scope) {
  $scope.todos = [];
  $scope.add = function () {
    $scope.todos.push($scope.todo);
    $scope.todo = "";
  };
}

ngl.Provider.controller("TodoCtrl", TodoCtrl);

ngl.DOMCompiler.bootstrap();