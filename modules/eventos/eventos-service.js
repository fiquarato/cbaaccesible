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
      return $http.post($rootScope.eventosService + 'saveevento', evento );
    };

    service.buscarEventoAvanzada = function(texto, discapacidades, fechaDesde, fechaHasta) {
      return $http.get($rootScope.eventosService + 'busquedaavanzada' + '?textoBusqueda='+ texto + 
      	'&nombresTipoDiscapacidad='+ discapacidades + '&fechaDesde=' + fechaDesde + '&fechaHasta=' + fechaHasta);
    };

    service.getOrganizaciones = function(){
      return $http.get($rootScope.organizacionService + 'findall');
    };
    
    return service;
});