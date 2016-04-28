var app = angular.module('medTrakrApp', ['ngRoute']);


app.controller('MainController', [function(){

}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/signin', {
          templateUrl: './partials/signin.html',
          controller: 'AuthController'
      }).
      when('/signup', {
          templateUrl: './partials/signup.html',
          controller: 'AuthController'
      }).
      when('/user', {
          templateUrl: './partials/user.html',
          controller: 'AuthController'
      }).
      otherwise({
          redirectTo: '/signin'
      });
}]);


app.controller('AuthController', ['$scope', '$http', '$location', function($scope,$http,$location) {

    $scope.user  = { email:'', password:'' };
    $scope.alert = '';

    $scope.login = function(user){
        console.log('login accessed');
        $http.post('/login', user).
            success(function(data) {
                $scope.loggeduser = data;
                $location.path('/user');
            }).
            error(function() {
                $scope.alert = 'Login failed'
            });

    };

    $scope.signup = function(user){
      console.log('signup accessed');
        $http.post('/signup', user).
            success(function(data) {
                $scope.alert = data.alert;
             }).
            error(function() {
                $scope.alert = 'Registration failed'
            });

    };

    // $scope.userinfo = function() {
    //     $http.get('/currentuser').
    //         success(function (data) {
    //             $scope.loggeduser = data;
    //         }).
    //         error(function () {
    //             $scope.alert = 'Login failed'
    //         });
    // };



    $scope.logout = function(){
      console.log('logged out');
        $http.get('/logout')
            .success(function() {
                $scope.loggeduser = {};
                $location.path('/signin');

            })
            .error(function() {
                $scope.alert = 'Logout failed'
            });
    };
}]);
