/**
 * Created by JoshuaBrummet on 3/12/17.
 */

'use strict';


var app = angular.module('fundMeow',[]);

app.controller('petCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/users').then(function(data){
        $scope.users = data;
        $scope.pets = [];
        for(var i = 0; i < $scope.users.data.users.length; i++){
            $scope.pets.push($scope.users.data.users[i].pet);
        }
        console.log($scope.pets);
    })
}]);