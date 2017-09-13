
angular.module('Moderacion') //DEFINO CONTROLADOR PARA ENTIDAD
.controller('ModeracionController',
  function ($scope, ModeracionService, $uibModal, Notification, $parse) {

    $scope.load = function(tipo){

        switch(tipo) {
        case 'organizacion':
        var promise = ModeracionService.getOrganizaciones();
        break;
        case 'lugar':
        var promise = ModeracionService.getLugares();
        break;
        case 'evento':
        var promise = ModeracionService.getEventos();
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

    $scope.load('organizacion');
    $scope.load('lugar');
    $scope.load('evento');


    $scope.aprobar = function(tipo, object){

      switch(tipo) {
        case 'organizacion':
        var promise = ModeracionService.aprobarOrganizacion(object);
        break;
        case 'lugar':
        var promise = ModeracionService.aprobarLugar(object);
        break;
        case 'evento':
        var promise = ModeracionService.aprobarEvento(object);
        break;
      }

      $scope.miPromesa = promise;
      $scope.miPromesa.then(
        function(response){         
          $scope.load(tipo);
          Notification.success({message: 'Aprobada correctamente', delay: 3000,  replaceMessage: true});
        }, function(error) {
          Notification.error({message: 'Ocurrio un error', delay: 3000,  replaceMessage: true});
        });
    };

    $scope.rechazar = function(tipo, object){

      switch(tipo) {
        case 'organizacion':
        var promise = ModeracionService.rechazarOrganizacion(object);
        break;
        case 'lugar':
        var promise = ModeracionService.rechazarLugar(object);
        break;
        case 'evento':
        var promise = ModeracionService.rechazarEvento(object);
        break;
      }

      $scope.miPromesa = promise;
      $scope.miPromesa.then(
        function(response){         
          $scope.load(tipo);
          Notification.success({message: 'Rechazado correctamente', delay: 3000,  replaceMessage: true});
        }, function(error) {
          Notification.error({message: 'Ocurrio un error', delay: 3000,  replaceMessage: true});
        });
    };

  });
