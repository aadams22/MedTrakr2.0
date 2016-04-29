var app = angular.module('medTrakrApp', ['ngRoute']);


app.controller('MainController', [function(){

}]);

//route configuration to set partials for authentication
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

    var validation = {
        isEmailAddress:function(str) {
            var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return pattern.test(str);  // returns a boolean
        },
        isNotEmpty:function (str) {
            var pattern =/\S+/;
            return pattern.test(str);  // returns a boolean
        },
        hasNumber:function(str) {
            var pattern = /^(?=.*\d).+$/;
            return pattern.test(str);  // returns a boolean
        },
        isSame:function(str1,str2){
            return str1 === str2;
        }
    };

    function userValidation(user) {
      if (validation.isNotEmpty(user.email) == false) { return $scope.alert = 'Please add an email.' }
      else if (validation.isNotEmpty(user.firstname) == false) { return $scope.alert = 'Please add your first name.' }
      else if (validation.isNotEmpty(user.lastname) == false) { return  $scope.alert = 'Please add your last name.' }
      else if (validation.isEmailAddress(user.email) == false) { return $scope.alert = 'Enter valid email.' }
      else if (validation.hasNumber(user.password) == false) { return $scope.alert = 'Password must include a number.' }
      else if (validation.isSame(user.password,user.password_verify) == false) { return $scope.alert = 'Your passwords don\'t match.' }
      else { return true };
    }

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
      console.log('signup accessed', user);
      if (userValidation(user) == true) {
        console.log(userValidation(user));
        $http.post('/signup', user).
            success(function(data) {
                $scope.alert = data.alert;
             }).
            error(function() {
                $scope.alert = 'Registration failed'
            });
      }
    };

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
