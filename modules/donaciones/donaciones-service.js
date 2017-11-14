'use strict';

angular.module('Donaciones')
.factory('DonacionesService',
  function ($http, $rootScope, $q) {

    var service = {};

    service.getDiscapacidades = function(){
      return $http.get($rootScope.tipoDiscapacidadService + 'findall');
    };

    service.getDonaciones = function(){
      return $http.get($rootScope.donacionesService + 'findbyestado?estado=APROBADO')
    };


    service.buscarDonacionAvanzada = function(texto, discapacidades) {
      return $http.get($rootScope.donacionesService + 'busquedaavanzada' + '?textoBusqueda='+ texto + 
        '&nombresTipoDiscapacidad='+ discapacidades);
    };

    service.crearDonacion = function(donacion) {
      return $http.post($rootScope.donacionesService + 'savedonacion', donacion );
    };

    return service;
});