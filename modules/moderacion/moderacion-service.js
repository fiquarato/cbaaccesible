
angular.module('Moderacion')
.factory('ModeracionService',
  function ($http, $rootScope, $q) {

    var service = {};

    service.getOrganizaciones = function() {
     return $http.get($rootScope.organizacionService + 'findall');
   };

   service.getEventos = function() {
     return $http.get('https://cbaaccesible.herokuapp.com/serviceevento/' + 'findall');
   };    

   service.getDonaciones = function() {
     return $http.get($rootScope.donacionesService + 'findall');
   };
   
   service.cambiarEstadoOrganizacion = function(options) {
    var deferred = $q.defer();
    console.log(options);
     $http.post($rootScope.organizacionService + 'setestado?' + 'id=' + options.id, options.estado).success(function (data) {
            deferred.resolve();
          });
      return deferred.promise;
   }; 

   service.cambiarEstadoEvento = function(options) {
    var deferred = $q.defer();     
     $http.post('https://cbaaccesible.herokuapp.com/serviceevento/' + 'setestado?' + 'id=' + options.id, options.estado ).success(function (data) {
            deferred.resolve();
          });
      return deferred.promise;
   }; 

   service.cambiarEstadoDonacion = function(options) {
    var deferred = $q.defer();     
     $http.post($rootScope.donacionesService + 'setestado?' + 'id=' + options.id, options.estado ).success(function (data) {
            deferred.resolve();
          });
      return deferred.promise;
   }; 

   return service;
   
 });

