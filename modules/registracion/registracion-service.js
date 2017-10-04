angular.module('Registracion')
.factory('RegistracionService',
  function ($http, $rootScope, $q) {

    var service = {};

    service.registrarUsuario = function(usuario) {
    
    	var deferred = $q.defer();

      $http.post($rootScope.registracionService + 'saveusuario', usuario).success(function(data){
        deferred.resolve();
      }).error( function(data){
      	
      });
    
    return deferred.promise;
    };

  return service;
});