angular.module('LogIn')
.factory('LogInService',
  function ($http, $rootScope, $q) {

    var service = {};
    
    service.logIn = function(logInData) {
	    return $http.get($rootScope.registracionService + 'login' + '?email='+ logInData.email + '&pass=' + logInData.password);
    };

  return service;
});
