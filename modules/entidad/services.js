'use strict';

angular.module('Entidad')
.factory('EntidadService',
  function ($http, $rootScope, $q){

    var service = {};
    
  service.getEntidades = function(){
    return $http.get($rootScope.organizacionService + 'findbyestado?estado=APROBADO');
  };

  service.crearEntidad = function(entidad){
    return $http.post($rootScope.organizacionService + 'saveorganizacion', entidad);
  };
  
  service.eliminarEntidad = function(id){
    return $http.get($rootScope.organizacionService + 'deletebyid' + '?id='+ id);
  };

  service.buscarEntidad = function(nombre){
    return $http.get($rootScope.organizacionService + 'findbynombre' + '?nombre='+ nombre);
  };

  service.buscarEntidadAvanzada = function(nombre, discapacidad, categoria){
    return $http.get($rootScope.organizacionService + 'busquedaavanzada' + '?textoBusqueda='+ nombre + '&nombresTipoDiscapacidad='+ discapacidad + '&nombresCategorias=' + categoria);
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


