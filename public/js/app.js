/* declare app */
var app = angular.module('tallyapp', ['ngRoute', 'ngResource', 'ui.materialize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider.
	when('/', {
		templateUrl: '/custom/views/home.html',
		controller: 'MainCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});

}]);

app.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
});

/* factory to return $resource object with RESTful methods */
app.factory('Student', ['$resource', function($resource) {

	/* prefix @ means id paramater will be in $scope._id (for MongoDB) */
	return $resource('/api/students/:id', {id: '@_id'});

}]);

app.controller('MainCtrl', ['$scope', 'Student', function($scope, Student) {
	$scope.student = new Student();
	$scope.activeSite = '';
	$scope.student.site = "";
	$scope.sites = {
		'Avondale': 'avondale', 
		'Queen Creek': 'Queen Creek', 
		'Northern': 'northern', 
		'Tempe': 'tempe', 
		'Surprise': 'surprise', 
		'Southern': 'southern', 
		'Thomas': 'thomas',
		'Luke': 'luke'
	};

	Student.query(function(data) {
		$scope.students = data;
	});

	$scope.add = function() {
		$scope.student.$save(function() {
			Materialize.toast('Student added!', 3000);
			$scope.student.fname = '';
			$scope.student.lname = '';
			$scope.student.site = '';
			$scope.addForm.$setPristine();

			Student.query(function(data) {
				$scope.students = data;
			});
		});
	};
}]);

