
angular.module('Moderacion')
.factory('ModeracionService',
  function ($http, $rootScope, $q) {

    var service = {};

    service.getOrganizaciones = function() {
     return $http.get($rootScope.organizacionService + 'findbyestado' + '?estado='+ 'PENDIENTE');
   };

   service.getLugares = function() {
     return $http.get($rootScope.entidadService + 'findbyestado' + '?estado='+ 'PENDIENTE');
   };

   service.getEventos = function() {
     return $http.get('http://localhost:8080/serviceevento/' + 'findbyestado' + '?estado='+ 'PENDIENTE');
   };    

   service.aprobarOrganizacion = function(organizacion) {
     return $http.post($rootScope.organizacionService + 'aprobarorganizacion', organizacion);
   };   

   service.aprobarLugar = function(lugar) {
     return $http.post($rootScope.entidadService + 'aprobarlugar', lugar);
   };   

   service.aprobarEvento = function(evento) {
     return $http.post('http://localhost:8080/serviceevento/' + 'aprobarevento', evento);
   };   

   service.rechazarOrganizacion = function(organizacion) {
     return $http.post($rootScope.organizacionService + 'rechazarorganizacion', organizacion);
   };   

   service.rechazarLugar = function(lugar) {
     return $http.post($rootScope.entidadService + 'rechazarlugar', lugar);
   };   

   service.rechazarEvento = function(evento) {
     return $http.post('http://localhost:8080/serviceevento/' + 'rechazarevento', evento);
   }; 

   return service;
   
 });

