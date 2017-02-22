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

/* factory to return $resource object with RESTful methods */
app.factory('Student', function($resource) {

	/* prefix @ means id paramater will be in $scope._id (for MongoDB) */
	return $resource('/api/students/:id', {id: '@_id'});

});

app.filter('filterSite', function() {
	return function(students, site) {
		var i = 0, len=students.length;
		for (i; i<len; i++) {
			if (students[i].site == site) {
				return students[i];
			}
		}
		return null;
	};
});

app.controller('MainCtrl', ['$scope', 'Student', function($scope, Student) {
	$scope.student = new Student();
	$scope.student.site = "";
	$scope.sites = ['avondale', 'queen creek', 'northern', 'tempe', 'surprise', 'southern', 'thomas'];

	Student.query({fields: 'site'}, function(data) {
		$scope.total = data.length;
		$scope.students = data;
	});

	$scope.add = function() {
		$scope.student.$save(function() {
			$scope.student.fname = '';
			$scope.student.lname = '';
			$scope.student.site = '';
			$scope.addForm.$setPristine();
		});
	};
}]);

