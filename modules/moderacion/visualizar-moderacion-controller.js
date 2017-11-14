'use strict';

angular.module('Moderacion')
.controller('VisualizarModeracionController',
    function ($scope, $uibModalInstance, Notification, objeto, tabActiva, ModeracionService, $rootScope) {

        $scope.comentarios = "";
        $scope.elemento = objeto;
        $scope.flagHistorial = false;

        var visualizarModalLugarDiscapacidad = function(entidad) { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
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

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancelar');
        };

        

        $scope.mostrarHistorial = function () {  //BOTON MOSTRAR HISTORIA
          if ($scope.flagHistorial == false) {
            $scope.flagHistorial = true;
          }else {
            $scope.flagHistorial = false;
          }
        };

        var validarOrganizador = function () {  //FUNCION QUE PREGUNTA SI EL ORGANIZADOR NO ESTA APROBADO
          var mensaje=confirm("El Evento que quiere Aprobar tiene asociado una organizacion no Aprobada, a continuacion le mostramos el detalle Organizacion para que pueda moderar ambos de una sola vez.");

            if(options.estado == 'APROBADO') {
              if($scope.elemento.organizador.estadoActual.estado == 'PENDIENTE' ||
               $scope.elemento.organizador.estadoActual.estado == 'EN MODERACION' ||
                $scope.elemento.organizador.estadoActual.estado == 'RECHAZADO' ) {
                  if(mensaje) {  //SI ACEPTA MENSAJE LE DEJAMOS MODERAR 2 
                  visualizarModalLugarDiscapacidad($scope.elemento.organizador); 
                  return 2;                    
                  }else {
                    return 0;
                  }
              }
            }else { return 1;}

        };

        $scope.crearNuevoEstado = function (id) {  //CREO NUEVO ESTADO A CUALQ ELEMENTO

          var options = { 
                          id: id,
                          estado: {
                            estado: $scope.estadoNuevo,
                            comentario: $scope.comentarioNuevo,
                            usuario: { id: $rootScope.usuarioLogged.id}
                          }
                        };

          switch(tabActiva) {
                  case 'organizaciones':
                  var miPromesa = ModeracionService.cambiarEstadoOrganizacion(options);
                  break;
                  case 'eventos':
                      var aux= 1;  //validarOrganizador(options);
                      if(aux == 1){                            
                        var miPromesa = ModeracionService.cambiarEstadoEvento(options);
                      } else if(aux == 2) {
                          //crearNuevoEstadoOrganizador();
                          var miPromesa = ModeracionService.cambiarEstadoEvento(options);                          
                        }else {
                            $scope.cancelar();
                        }                        
                  break;
                  case 'donaciones':
                  var miPromesa = ModeracionService.cambiarEstadoDonacion(options);
                  break;
                  
          }
          miPromesa.then(
              function (response) {
                  $scope.cancelar();
                  Notification.success({ message: 'El estado se modificó correctamente', delay: 3000 });
                  $rootScope.$broadcast('updateList'); //actualizar pagina dps de cambiar estado
              }, function (error) {
                  if (error.data.message) {
                      Notification.error({ message: error.data.message, delay: 3000 });
                  } else {
                      Notification.error({ message: 'Ocurrio un error al modificar el estado', delay: 3000 });
                  }
          });  


        };

        var crearNuevoEstadoOrganizador = function () {  //FUNCION QUE MODERA LA ORGANiZACION VINCULADA A UN EVENTO

          var options = { 
                          id: $scope.elemento.organizador.id,
                          estado: {
                            estado: $scope.estadoNuevo,
                            comentario: $scope.comentarioNuevo,
                            usuario: { id: $rootScope.usuarioLogged.id}
                          }
                        };

          var miPromesa = ModeracionService.cambiarEstadoOrganizacion(options);

          miPromesa.then(
              function (response) {
                  $scope.cancelar();
                  Notification.success({ message: 'El estado de la Organizacion asociada se cambió correctamente', delay: 3000 });
              }, function (error) {
                  if (error.data.message) {
                      Notification.error({ message: error.data.message, delay: 3000 });
                  } else {
                      Notification.error({ message: 'Ocurrio un error al modificar el estado', delay: 3000 });
                  }
          });  

        };

});