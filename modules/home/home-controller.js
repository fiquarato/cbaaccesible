
angular.module('Home', ['uiGmapgoogle-maps']) //DEFINO CONTROLADOR PARA ENTIDAD
.controller('HomeController',
  function ($scope, HomeService, $confirm, $filter, $uibModal, $anchorScroll, $location, Notification, $rootScope) {

    $scope.usuario = $rootScope.usuario;

  	$scope.visualizarModalLogIn = function() { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/log-in/views/log-in.html',
        controller: 'LogInController',
        resolve: {
          init: function(){
            return $scope.init;
          }
        },
          size: 'sm' //'lg' para large, 'md' para medium y 'sm' para small
        });
    };

    $scope.logOut = function() {
      $rootScope.usuarioLogged = undefined;
    };

  });