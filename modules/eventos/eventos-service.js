'use strict';

angular.module('Eventos')
.factory('EventosService',
  function ($http, $rootScope, $q) {

    var service = {};

    service.getEventos = function() {
      return $http.get($rootScope.eventosService + '/findbyestado?estado=APROBADO');
    };

    service.getDiscapacidades = function(){
      return $http.get($rootScope.tipoDiscapacidadService + 'findall');
    };

    service.cargarEvento = function( evento ){

      var deferred = $q.defer();
      
      $http.get('https://maps.google.com/maps/api/geocode/json?address=' + evento.direccion.calle + '+' + evento.direccion.numero + '+cordoba+argentina')
        .success(function (data) {
          evento.direccion.latitud = data.results[0].geometry.location.lat;
          evento.direccion.longitud = data.results[0].geometry.location.lng;
          $http.post($rootScope.eventosService + 'saveevento', evento ).success(function (data) {
            deferred.resolve();
          });
        })
        .error(function (err) {
          deferred.reject(err)
        });

      return deferred.promise;

    };

    service.buscarEventoAvanzada = function(texto, discapacidades, fechaDesde, fechaHasta) {
      return $http.get($rootScope.eventosService + 'busquedaavanzada' + '?textoBusqueda='+ texto + 
      	'&nombresTipoDiscapacidad='+ discapacidades + '&fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta);
    };

    return service;
});