angular.module('Registracion')
.controller('RegistracionController', 
  function ($scope, $uibModal, $uibModalInstance, Notification,init, RegistracionService) {

    $scope.usuario= '';

    

    $scope.visualizarModalRegistracionUsuario = function() { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
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

    $scope.registrarUsuario = function () {

      var miPromesa = RegistracionService.registrarUsuario($scope.usuario);

      miPromesa.then(
        function(response){
          Notification.success({message: 'El usuario se registro correctament.', delay: 3000});
          $scope.cancelar();
        }, function(error) {
          if(error.data.message) {
            Notification.error({message: error.data.message, delay: 3000});
          } else {
            Notification.error({message: 'El usuario no se ha podido registrar.', delay: 3000});
          }
        });

    };

	$scope.cancelar = function() {
      $uibModalInstance.dismiss('cancelar');
    };

  
    $scope.validarFuncion = function(){
      var confirm_password = document.getElementById("confirm_password");
      if($scope.usuario.pass != $scope.password2) {
       confirm_password.setCustomValidity("Passwords Don't Match");
      } else {
        confirm_password.setCustomValidity('');
      }
    };


  });