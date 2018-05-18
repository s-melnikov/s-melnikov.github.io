function TodoCtrl($scope) {
  $scope.todos = ["first","second","third"];
  $scope.add = function () {
    $scope.todos.push($scope.todo);
    $scope.todo = "";
  };
}

ngl.controller("TodoCtrl", TodoCtrl);

ngl.bootstrap();