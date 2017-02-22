/* declare app */
var app = angular.module('tallyapp', ['ngRoute', 'ngResource', 'ui.materialize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

}]);

/* factory to return $resource object with RESTful methods */
app.factory('API', function($resource) {
	return $resource('/api/students/:id');
});

app.controller('MainController', ['$scope', function($scope) {
	$scope.student = {};
	$scope.sites = ['Avondale', 'Queen Creek', 'Northern', 'Tempe', 'Surprise', 'Southern', 'Thomas'];
}]);

