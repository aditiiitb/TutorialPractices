angular.module("myapp", []).controller('mycntl', function($scope) {
	$scope.yourName="default";
	$scope.greeting="oye"
	$scope.personArray=[{name: "Aditi"}, {name: "cookie"}]
})