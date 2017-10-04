angular.module('LogIn')
.controller('LogInController', 
  function ($scope, $rootScope, $uibModalInstance, $uibModal, Notification,init, $route, LogInService) {
    
    $scope.usuario= '';
    $scope.pass = '';

    $scope.visualizarModalRegistracion = function() { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/registracion/views/registracion-formulario-inicial.html',
        controller: 'RegistracionController',
        resolve: {
          init: function(){
            return $scope.init;
          }
        },
          size: 'md' //'lg' para large, 'md' para medium y 'sm' para small
        });
    };

    $scope.visualizarModalRegistracionUsuario = function() { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
      
      $scope.cancelar();

      var modalInstance = $uibModal.open({
        templateUrl: 'modules/registracion/views/registracion-formulario-persona.html',
        controller: 'RegistracionController',
        resolve: {
          init: function(){
            return $scope.init;
          }
        },
          size: 'md' //'lg' para large, 'md' para medium y 'sm' para small
        });
    };

    $scope.logIn = function() {

      var logInData = {
        email: $scope.usuario,
        password: $scope.pass
      };

      var miPromesa = LogInService.logIn(logInData);

      miPromesa.then(
        function(response){
          Notification.success({message: 'El usuario se logueo correctamente.', delay: 3000});
          $rootScope.usuarioLogged = response.data;
          $scope.cancelar();
        }, function(error) {
          if(error.data.message) {
            Notification.error({message: error.data.message, delay: 3000});
          } else {
            Notification.error({message: 'usuario o contraseña invalida.', delay: 3000});
          }
        });

    };

     $scope.cancelar = function() {
      $uibModalInstance.dismiss('cancelar');
    };

  });