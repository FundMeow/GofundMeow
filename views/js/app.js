/**
 * Created by JoshuaBrummet on 3/12/17.
 */

'use strict';

var app = angular.module('fundMeow', ['ngRoute', /*'ngFileUpload'*/]);


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
        .when('/payment', {
            templateUrl: 'payment.ejs'
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
    userService.set($scope.userId);
    $scope.userId = $routeParams.userId;

}]);

app.controller('userCtrl', ['$scope', '$http','userService', 'Upload',
    function($scope, $http, userService, Upload, $routeParams, $log, $location, $localStorage) {

        var _id = userService.get();
        $http.get('/user/' + _id, {
            cache: true
        }).then(function(data){
            $scope.user = data.data;
            $scope.pets = [];
            $scope.img = _arrayBufferToBase64($scope.user.img);
            for(var i = 0; i < $scope.user.user.pet.length; i++){
                $scope.pets.push($scope.user.user.pet[i]);

            }
           // console.log($scope.pets);

        });

        function _arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }

        //Image upload
        $scope.upload = function(dataUrl, name) {
            Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',//'localhost:8080/user/' + $scope.userId + '/petpicture',
                data: {
                    file: Upload.dataUrltoBlob(dataUrl, name)
                },
            }).then(function(response) {
                $timeout(function() {
                    $scope.result = response.data;
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
}]);

// app.controller('imageCtrl', ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
//     $scope.upload = function(dataUrl, name) {
//         Upload.upload({
//             url: 'localhost:8080/user/' + $scope.userId + '/petpicture',
//             data: {
//                 file: Upload.dataUrltoBlob(dataUrl, name)
//             },
//         }).then(function(response) {
//             $timeout(function() {
//                 $scope.result = response.data;
//             });
//         }, function(response) {
//             if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
//         }, function(evt) {
//             $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
//         });
//     }
// }]);