function TodoCtrl($scope) {
  $scope.todos = ["first","second","third"];
  $scope.todo = "Enter task...";
  $scope.add = function () {
    $scope.todos.push($scope.todo);
    $scope.todo = "Enter task...";
  };
}

ngl.controller("TodoCtrl", TodoCtrl);

ngl.bootstrap();