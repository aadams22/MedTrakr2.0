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

    //callback used for validating user signup information returns message to user to define the issue
    function userValidation(user) {
      if (!validation.isNotEmpty(user.email)) { return $scope.alert = 'Please add an email.' }
      else if (!validation.isNotEmpty(user.firstname)) { return $scope.alert = 'Please add your first name.' }
      else if (!validation.isNotEmpty(user.lastname)) { return  $scope.alert = 'Please add your last name.' }
      else if (!validation.isEmailAddress(user.email)) { return $scope.alert = 'Enter valid email.' }
      else if (!validation.hasNumber(user.password)) { return $scope.alert = 'Password must include a number.' }
      else if (user.password.length < 8) { return $scope.alert = 'Your password must be at least 8 characters long.' }
      else if (!validation.isSame(user.password,user.password_verify)) { return $scope.alert = 'Your passwords don\'t match.' }
      else { return true };
    }

    //LOGIN REQUEST
    $scope.login = function(user){
        $http.post('/login', user).
            success(function(data) {
                $scope.loggeduser = data;
                $location.path('/user');
            }).
            error(function() {
                $scope.alert = 'Login failed'
            });

    };

    //SIGNUP REQUEST
    $scope.signup = function(user){
      //refers to userValidation callback to validate user signup information.
      //it will not proceed to save the user if user information is not validated
      if (userValidation(user) == true) {
        console.log("it's saving ", userValidation(user));
        $http.post('/signup', user).
            success(function(data) {
                $scope.alert = data.alert;
             }).
            error(function() {
                $scope.alert = 'Registration failed'
            });
      }
    };

    //LOGOUT REQUEST
    $scope.logout = function(){
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
