var app = angular.module('medTrakrApp', ['ngRoute', 'tc.chartjs']);


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

    $scope.user  = { email:'', password:'', firstName:'' };
    $scope.alert = '';
    $scope.logoutbutton = false;


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
                $scope.logoutbutton = true;
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
                $scope.logout
                $location.path('/signin');
            })
            .error(function() {
                $scope.alert = 'Logout failed'
            });
    };

    $scope.showLogout = function() {
      console.log('1. show logout', $scope.logoutbutton);
      $scope.logoutbutton = true;
      console.log('2. show logout', $scope.logoutbutton);
    };

}]);


app.controller('CurrentMedController', ['$scope', '$http', function($scope,$http){
    var d = Date.now();

    $http.get('/json').
        success(function(data){
          $scope.meds = data.meds;
          // console.log('original array: ', $scope.meds);
        }).
        error(function(err){
          console.log(err);
        });

        // compares the last time the med was taken to the next time the med should be taken by adding together
        // the last time taken and the amount of time between dosages
        if ($scope.meds != undefined) {
          for (var i = 0; i < $scope.meds.length; i++) {
            console.log('running for loop');
            if ($scope.meds[i].lastTimeTaken >= $scope.meds[i].lastTimeTaken + $scope.meds[i].tillNext) {
              $scope.meds[i].taken = false;
              console.log('it works', $scope.meds[i].taken);
            };
          };
        };


      // Chart.js Data
      $scope.data = [
        {
          value: 300,
          color:'#F7464A',
          highlight: '#FF5A5E',
          label: 'Medication'
        },
        {
          value: 50,
          color: '#46BFBD',
          highlight: '#5AD3D1',
          label: 'Frequency'
        },
        {
          value: 100,
          color: '#FDB45C',
          highlight: '#FFC870',
          label: 'Till Empty'
        }
      ];

      // Chart.js Options
      $scope.options =  {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,

        //String - The colour of each segment stroke
        segmentStrokeColor : '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth : 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout : 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps : 100,

        //String - Animation easing effect
        animationEasing : 'easeOutBounce',

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate : true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale : false,

        //String - A legend template
        legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

      };

      $scope.takenMed = function($index) {
        console.log(d);
        console.log($scope.meds[$index].tillNext);
        console.log($scope.meds[$index].lastTimeTaken);
        console.log($scope.meds[$index]);
        //sets the front end meds array taken value according to click
        $scope.meds[$index].taken = $scope.meds[$index].taken = true;
        //sets the last time taken to the current time and date
        $scope.meds[$index].lastTimeTaken = d;

        $http.post('/takenMed', $scope.meds[$index]).
            success(function(data) {
              console.log('this is success data: ', data.meds);
           }).
           error(function(err) {
               console.log(err);
           });

      };

      $scope.one = false;
      $scope.showOne = function() {
        $scope.one = true;
      };

      $scope.delete = false;
      $scope.showDelete = function() {
        ($scope.delete) ? $scope.delete = false : $scope.delete = true;
      };

      $scope.close = function() {
        $scope.one = false;
      };

      //ADDS NEW MED
      $scope.addMed = function(user) {
        //adds new med to front end med array
        $scope.meds.push(user.meds);
        //hides add med form after submition
        $scope.one = false;
        console.log(user.meds.frequency.timeFrequency);
        //sends newly created med to server to save in database
        $http.post('/createMed', user.meds).
            success(function(data) {
                // $scope.formAlert = data.formAlert;
                console.log('this is success data: ', data);
             }).
            error(function(err) {
                // $scope.formAlert = 'Oops! Something went wrong! Refresh and try again.'
                console.log(err);
            });
      };

      //DELETES MED
      $scope.deleteMed = function($index) {
        //removes deleted med from front end array
        $scope.meds.splice($index);
        //hides the individual delete buttons
        $scope.delete = false;
        //sends post request to remove delete med from current meds and add to past meds list
        $http.post('/createTakenMed', $scope.meds[$index]).
            success(function(data) {
              console.log('this is success data: ', data.meds);
           }).
           error(function(err) {
               console.log(err);
           });

     };


}]);
