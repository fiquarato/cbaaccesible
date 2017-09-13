'use strict';

angular.module('Entidad')
.factory('EntidadService',
  function ($http, $rootScope, $q) {

    var service = {};
    
    service.getEntidades = function() {
/*     return $http.get($rootScope.entidadService + 'findall');  LLAMADA AL SERVICIO PARA QUE TRAIGA TODOS LOS LUGARES*/
     return $http.get($rootScope.entidadService + 'findbyestado?estado=APROBADO');
     
   };

   service.crearEntidad = function(entidad) {
    
    var deferred = $q.defer();

    $http.get('http://maps.google.com/maps/api/geocode/json?address=' + entidad.direccion.calle + '+' + entidad.direccion.numero + '+cordoba+argentina')
    .success(function(data) {
      entidad.direccion.latitud = data.results[0].geometry.location.lat;
      entidad.direccion.longitud = data.results[0].geometry.location.lng;
      $http.post($rootScope.entidadService + 'savelugar', entidad).success(function(data){
        deferred.resolve();
      });
    })
    .error(function(err) {
      deferred.reject(err)
    });

    return deferred.promise;
  }
  service.eliminarEntidad = function(id) {
    return $http.get($rootScope.entidadService + 'deletebyid' + '?id='+ id);
  };

  service.buscarEntidad = function(nombre) {
    return $http.get($rootScope.entidadService + 'findbynombre' + '?nombre='+ nombre);
  };

  service.buscarEntidadAvanzada = function(nombre, discapacidad, categoria) {
    return $http.get($rootScope.entidadService + 'busquedaavanzada' + '?textoBusqueda='+ nombre + '&nombresTipoDiscapacidad='+ discapacidad + '&nombresCategorias=' + categoria);
  };

  service.getDiscapacidades = function(){
    return $http.get($rootScope.tipoDiscapacidadService + 'findall');
  };

  service.getCategorias = function(){
    return $http.get($rootScope.categoriasService + 'findall');
  };

  service.getSubcategoriasById = function(id){
    return $http.get($rootScope.subCategoriasService + 'findbycategoriaid?id='+id);
  };

  service.getSubcategorias = function(){
    return $http.get($rootScope.subCategoriasService + 'findall');
  };

  return service;
});


