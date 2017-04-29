/**
 * Created by JoshuaBrummet on 3/12/17.
 */

'use strict';

var app = angular.module('fundMeow', ['ngRoute']);


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
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.factory('userService', function () {

    var data = {
        _id: ''
    };
    return {
        get: function () {
            return data._id;
        },
        set: function (_id) {
            data._id = _id;
        }
    };
});

app.controller('mainCtrl',['$scope', function($scope, $routeParams, $route, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

}]);

app.controller('petCtrl', ['$scope', '$http','userService','$routeParams',
    function($scope, $http, userService, $routeParams, $route, $localStorage, $location) {

    $http.get('/users').then(function(data){
        $scope.users = data;
        $scope.pets = [];
        for(var i = 0; i < $scope.users.data.users.length; i++){
            $scope.pets.push($scope.users.data.users[i].pet);
            $scope.pets[i]._id = $scope.users.data.users[i]._id;
        }
    });

    $scope.userId = 0;

    $scope.profile = function(userId){
        $scope.userId = userId;
        userService.set($scope.userId);
    };
}]);

app.controller('userCtrl', ['$scope', '$http','userService',
    function($scope, $http, userService, $routeParams, $log, $location, $localStorage) {

        var _id = userService.get();
        $http.get('/user/' + _id, {
            cache: true
        }).then(function(data){
            $scope.user = data.data;
            $scope.pets = [];
            for(var i = 0; i < $scope.user.user.pet.length; i++){
                $scope.pets.push($scope.user.user.pet[i]);

            }
            console.log($scope.pets);

        })
}]);

