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
    });

    $scope.profile = function(userId){
        console.log(userId);
        // $scope._id = userId;
        // $http.get('/user'+ userId).then(function(data){
        //     console.log(data);
        // })
    }

}]);
app.controller('userCtrl', ['$scope', '$http', function($scope, $http) {

    // var user_id = $scope._id;
    // console.log(user_id);
    //
    //
    // $http.get('/user'+ user_id).then(function(data){
    //     console.log(data);
    //     // $scope.user = data;
    //     // $scope.pet = [];
    //     // for(var i = 0; i < $scope.user.data.pet.length; i++){
    //     //     $scope.pets.push($scope.user.data.user[i].pet);
    //     // }
    //     // console.log($scope.pet);
    //
    // })

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


