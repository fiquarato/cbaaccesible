'use strict';

angular.module('Moderacion') //DEFINO CONTROLADOR PARA ENTIDAD
.controller('ModeracionController',
  function ($scope, $rootScope, $location, ModeracionService, $uibModal, Notification, $parse) {           
    
    $scope.load = function(tipo){

      $scope.listaorganizacion = [];
      $scope.listaevento = [];

        switch(tipo) {
        case 'organizacion':
        var promise = ModeracionService.getOrganizaciones();
        break;        
        case 'evento':
        var promise = ModeracionService.getEventos();
        break;
        case 'donacion':
        var promise = ModeracionService.getDonaciones();
        break;
      }
      $scope.miPromesa = promise;
      $scope.miPromesa.then(
        function(response){        
        var model = $parse('lista'+tipo); 
        model.assign($scope, response.data);
        }, function(error) {
          $scope.organizaciones = [];
          Notification.error({message: 'Ocurrio un error al cargar '+tipo, delay: 3000,  replaceMessage: true});
        });
    };

    $scope.init = function() {
        if ($rootScope.usuarioLogged == undefined || $rootScope.usuarioLogged.tipoUsuario != 'MODERADOR') {
          $location.path('#');
        }
        $scope.tabActiva = 'organizaciones';

       $scope.load('organizacion');
       $scope.load('evento');
       $scope.load('donacion');

    };


    $scope.logOut = function() {
      $rootScope.usuarioLogged = undefined;
      $location.path('#');
    };

    $scope.$on("updateList", function(){
      $scope.load('organizacion');
      $scope.load('evento');
      $scope.load('donacion');
    });


    $scope.visualizarModalEvento = function(evento) { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
            var modalInstance = $uibModal.open({
              templateUrl: 'modules/eventos/views/visualizarEvento.html',
              controller: 'VisualizarEventoController',
              resolve: {
                 evento: function() {
                  return evento;
                }
              },
                size: 'lg' //'lg' para large, 'md' para medium y 'sm' para small
              });

            
    };

    $scope.visualizarModalDonacion = function(evento) { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
            

            
    };

    $scope.visualizarModalLugarDiscapacidad = function(entidad) { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/entidad/views/visualizarlugar.html',
        controller: 'VisualizarLugarController',
        resolve: {
          entidades: function() {
            return $scope.listado;
          },
          init: function(){
            return $scope.init;
          },
          entidad: function() {
            return entidad;
          }
        },
          size: 'lg' //'lg' para large, 'md' para medium y 'sm' para small
        });
    };

    $scope.visualizarModalModeracion = function(objeto, tabActiva) { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/moderacion/views/moderacion-modal.html',
        controller: 'VisualizarModeracionController',
        resolve: {
          init: function(){
            return $scope.init;
          },
          objeto: function() {
            return objeto;
          },
          tabActiva: function() {
            return $scope.tabActiva;
          }
        },
          size: 'md' //'lg' para large, 'md' para medium y 'sm' para small
        });
    };

     $scope.init();   

  });