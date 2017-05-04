/**
 * Created by JoshuaBrummet on 3/12/17.
 */

'use strict';

var app = angular.module('fundMeow', ['ngRoute','ngCookies', 'ngMaterial', 'ngFileUpload', 'ngImgCrop']);

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
            templateUrl: 'signup.html',
            controller: 'signupCtrl'
        })
        .when('/user/:userId/pet_donate/:petId', {
            templateUrl: 'transaction.html',
            controller: 'paymentCtrl'
        })
        .otherwise({
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


app.controller('paymentCtrl', ['$scope', '$http','$cookieStore','$routeParams',
    function($scope, $http, $cookieStore, $routeParams) {
    console.log($routeParams.petId);
        $scope.message = 'Please use the form below to pay:';
        $scope.showDropinContainer = true;
        $scope.isError = false;
        $scope.isPaid = false;

        $scope.getToken = function () {

            $http({
                method: 'GET',
                url: '/payment'
            }).success(function (data) {

                console.log(data.client_token);


                braintree.setup(data.client_token, 'dropin', {
                    container: 'checkout',
                    // Form is not submitted by default when paymentMethodNonceReceived is implemented
                    paymentMethodNonceReceived: function (event, nonce) {
                        console.log(event);

                        $scope.message = 'Processing your payment...';
                        $scope.showDropinContainer = false;

                        $http({
                            method: 'POST',
                            url: '/process',
                            data: {
                                amount: $scope.amount,
                                payment_method_nonce: nonce
                            }
                        }).success(function (data) {

                            console.log(data.success);
                            console.log($scope.amount);
                            console.log(nonce);

                            if (data.success) {
                                $scope.message = 'Payment authorized, thanks.';
                                $scope.showDropinContainer = false;
                                $scope.isError = false;
                                $scope.isPaid = true;
                                var _id = $routeParams.userId;
                                //updating user
                                var funds = $scope.amount;

                                $http.get('/user/' + _id).then(function(data) {
                                    console.log(data.data);
                                    $scope.user = data.data;
                                    for (var i =0; i < $scope.user.user.pet.length; i++){
                                        console.log($scope.user.user.pet[i]._id);
                                        console.log($routeParams.petId);
                                        if($scope.user.user.pet[i]._id == $routeParams.petId){
                                            $scope._user ={
                                                userName: $scope.user.user.userName,
                                                passWord: $scope.user.user.passWord,
                                                firstName: $scope.user.user.firstName,
                                                lastName: $scope.user.user.lastName,
                                                pet: []
                                            };
                                            console.log($scope._user);
                                            $scope.user.user.pet[i].funds += funds;
                                            $scope._user.pet.push($scope.user.user.pet[i]);
                                            console.log($scope._user);
                                            $http({
                                                method: 'PUT',
                                                url: '/user/'+_id,
                                                data:{
                                                    user: $scope._user
                                                }
                                            }).then(function(data){
                                                console.log(data);
                                            })
                                        }
                                    }
                                });
                            } else {
                                // implement your solution to handle payment failures
                                $scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
                                $scope.isError = true;
                            }

                        }).error(function (error) {
                            $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
                            $scope.showDropinContainer = false;
                            $scope.isError = true;
                        });

                    }
                });

            }).error(function (error) {
                $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
                $scope.showDropinContainer = false;
                $scope.isError = true;
            });

        };

        $scope.getToken();
    }]);

app.controller('signupCtrl', ['$scope','$http','$cookieStore','$routeParams', 'Upload', '$timeout',
    function($scope, $http, $cookieStore, $routeParams, Upload, $timeout) {

        $scope.userName = '';
        $scope.password = '';
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.age = 0;
        $scope.location = '';
        $scope.phone = '';
        $scope.email = '';
        $scope.img = '';

        $scope.user = {
            userName: $scope.userName,
            password: $scope.password,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            age: $scope.age,
            location: $scope.location,
            phone: $scope.phone,
            email: $scope.email,
            img: $scope.img
        };

        var user = $scope.user;
        $scope.register = function() {
            $http({
                method: 'POST',
                url: '/users',
                data: user
            }).success(function (data) {
                console.log(data.created);
                $scope.user = data.created;

                $scope.upload = function() {
                    console.log($scope.file);
                    var arrayBuffer;
                    var fileReader = new FileReader();
                    fileReader.onload = function () {
                        arrayBuffer = this.result;
                    };
                    fileReader.readAsArrayBuffer($scope.file);

                    var formData = new FormData();
                    formData.append('data', arrayBuffer);
                    formData.append('type', $scope.file.type);

                    $http({
                        method: 'POST',
                        url: '/user/' + $scope.user._id + '/petpicture',
                        data: $scope.file
                    })
                };
                // $scope.submit = function() {
                //     if ($scope.form.file.$valid && $scope.file) {
                //         $scope.upload($scope.file);
                //     }
                // };


                // $scope.upload = function (dataUrl, name) {
                //     Upload.upload({
                //         url: 'http://localhost:8080/user/' + $scope.user._id + '/petpicture',
                //         data: {
                //             file: Upload.base64DataUrl(dataUrl, name)
                //         }
                //     }).then(function (response) {
                //         $timeout(function () {
                //             $scope.result = response.data;
                //         });
                //     }, function (response) {
                //         if (response.status > 0) $scope.errorMsg = response.status
                //             + ': ' + response.data;
                //     }, function (evt) {
                //         $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                //     });
                // };
            }).error(function (data) {
                console.log("error");
            })
        }
    }]);