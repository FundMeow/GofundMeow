/**
 * Created by JoshuaBrummet on 3/12/17.
 */

'use strict';

var app = angular.module('fundMeow', ['ngRoute','ngCookies']);

//Configurations for web app routes.
app.config(function($routeProvider, $locationProvider){

    $routeProvider
        .when('/',{
            templateUrl: 'home.html'
        })
        .when('/pets', {
            templateUrl: 'pets.html',
            controller: 'petCtrl'
        })
        .when('/user/:userId/user_profile', {
            templateUrl: 'user.html',
            controller: 'userCtrl'
        })
        .when('/sign-up', {
            templateUrl: 'signup.html'
        })
        .when('user/:userId/pet_donate/:petId', {
            templateUrl: 'payment.html',
            controller: 'paymentCtrl'
        }).otherwise({
            redirectTo: '/'
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

//Main Controller. No main functionality.
app.controller('mainCtrl',['$scope', function($scope, $routeParams, $route, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

}]);

app.controller('petCtrl', ['$scope', '$http','$routeParams',
    function($scope, $http, $routeParams) {

//Getting User information.
    $http.get('/users').then(function(data){

        $scope.users = data;
        $scope.pets = [];
        $scope.imgArray = [];

        //Assigning new angular objects data from the request.
        for(var i = 0; i < $scope.users.data.users.length; i++){
            $scope.img = _arrayBufferToBase64($scope.users.data.users[i].img.data);
            $scope.imgArray.push($scope.img);
            $scope.pets.push($scope.users.data.users[i].pet);
            $scope.pets[i]._id = $scope.users.data.users[i]._id;
        }

        //Assigning each pet a image. Hard coded for time purposes.
        var j = 0;
        $scope.pets.forEach(function (newPet) {
            newPet.img = $scope.imgArray[j];
            j++;
        });
        console.log($scope.pets);
    });

//Function to convert buffer to base64
    function _arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
}]);

//User profile Controller.
app.controller('userCtrl', ['$scope', '$http','$cookieStore','$routeParams',
    function($scope, $http, $cookieStore, $routeParams) {

    //Get user Id and use it to retrieve the user info from the API. with a http request.

        //gets Id from URL path.
        var __id = $routeParams.userId;

        $http.get('/user/' + __id, {
            cache: true
        }).then(function(data){
            $scope.user = data.data;
            $scope.pets = [];
            $scope.img = _arrayBufferToBase64(data.data.user.img.data);
            for(var i = 0; i < $scope.user.user.pet.length; i++){
                $scope.pets.push($scope.user.user.pet[i]);
            }
        });

    //Converting image to base64.
        function _arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
}]);
