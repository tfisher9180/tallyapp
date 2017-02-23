/* declare app */
var app = angular.module('tallyapp', ['ngRoute', 'ngResource', 'ui.materialize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider.
	when('/', {
		templateUrl: '/custom/views/home.html',
		controller: 'MainCtrl'
	}).
	when('/:site', {
		templateUrl: '/custom/views/view.html',
		controller: 'ViewCtrl'
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

app.factory('Count', [function(Student) {

	return {
		getCountBySite: function(data, sites) {

			var counts = {};
			counts.total = data.length
			angular.forEach(sites, function(site) {
				if (data.length > 0) {
					var count = 0;
					for (var i = 0; i < data.length; i++) {
						if (data[i].site == site) {
							count++;
						}
					}
					counts[site] = count;
				} else {
					counts[site] = 0;
				}
			});
			return counts;

		}
	};

}]);

app.controller('MainCtrl', ['$scope', 'Count', 'Student', function($scope, Count, Student) {
	$scope.student = new Student();
	$scope.student.site = "";
	$scope.sites = {
		'Avondale': 'avondale', 
		'Queen Creek': 'queen_creek', 
		'Northern': 'northern', 
		'Tempe': 'tempe', 
		'Surprise': 'surprise', 
		'Southern': 'southern', 
		'Thomas': 'thomas',
		'Luke': 'luke'
	}

	Student.query({fields: 'site'}, function(data) {
		$scope.counts = Count.getCountBySite(data, $scope.sites);
	});

	$scope.add = function() {
		$scope.student.$save(function() {
			Materialize.toast('Student added!', 3000);
			$scope.student.fname = '';
			$scope.student.lname = '';
			$scope.student.site = '';
			$scope.addForm.$setPristine();

			Student.query({fields: 'site'}, function(data) {
				$scope.counts = Count.getCountBySite(data, $scope.sites);
			});
		});
	};
}]);

app.controller('ViewCtrl', ['$scope', '$routeParams', 'Student', function($scope, $routeParams, Student) {
	var site = $routeParams.site;
	$scope.site = site;

	Student.query({site: site}, function(data) {
		$scope.students = data;
	});
}]);

