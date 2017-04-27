/**
 * Created by JoshuaBrummet on 3/12/17.
 */

'use strict';

var app = angular.module('fundMeow',[]);


app.factory('userService', function(){
    var _user = {};
    function set(data){
        _user.push(data);
        console.log(_user);
    }
    function get(){
        console.log(user);
        return _user
    }
    return {
        set: set,
        get: get
    }
});

app.controller('petCtrl', ['$scope', '$http','userService', function($scope, $http, userService) {

    $http.get('/users').then(function(data){
        $scope.users = data;
        $scope.pets = [];
        console.log($scope.users);
        for(var i = 0; i < $scope.users.data.users.length; i++){
            $scope.pets.push($scope.users.data.users[i].pet);
            $scope.pets[i]._id = $scope.users.data.users[i]._id;
        }
        console.log($scope.pets);
    });

    $scope.profile = function(userId){
        userService.set(userId);
        $http.get('/user/' + userId).then(function(data){
            console.log(data.data.user);
            $scope._user = data.data.user;
        })
    }
}]);

app.controller('userCtrl', ['$scope', '$http', 'userService', function($scope, $http, userService) {

    var user_id = userService.get();
    console.log(user_id);
    $http.get('/user/' + user_id).then(function(data){
        console.log(data);
        $scope._user = data.data.user;
    })

}]);

app.controller('imageCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.savePhoto = function () {
        var fd = new FormData();
        fd.append("file", $scope.files[0]);

    $http.post("", fd, {
        withCredentials: true,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
    }).success(function (data) {
        $scope.image = data; // If you want to render the image after successfully uploading in your db
    });
};
}]);


