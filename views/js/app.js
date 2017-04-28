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
        .when('/user/:userId', {
            templateUrl: 'user.html',
            controller: 'userCtrl',
            resolve: {
                // I will cause a 1 second delay
                delay: function ($q, $timeout) {
                    var delay = $q.defer();
                    $timeout(delay.resolve, 1000);
                    return delay.promise;
                }
            }
        })
        .when('/sign-up', {
            templateUrl: 'signup.html'
        })
        // .otherwise({
        //     redirectTo: '/'
        // });
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
app.run(['$route', function($route)  {
    $route.reload();
}]);

app.controller('mainCtrl',['$scope', function($scope, $routeParams) {

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

    $scope._id = 0;

    $scope.profile = function(userId){
        $scope._id = userId;
    };
    console.log($scope._id);
    userService.set($scope._id);
    $scope._id = $routeParams;

}]);

app.controller('userCtrl', ['$scope', '$http','userService',
    function($scope, $http, userService, $routeParams, $localStorage ) {
    $scope._id = userService.get();
    $http.get('/user/'+ $scope._id).then(function(data){
        console.log(data);
        $scope.user = data.data;
    });

}]);

