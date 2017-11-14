angular.module('Donaciones',[])
.controller('PrincipalDonacionesController',
function( $scope, DonacionesService, $uibModal, $confirm, $filter, $anchorScroll, $location, Notification, $rootScope){

    var hayDonaciones = false;
    $scope.mensajeGrilla = "";
    $scope.discapacidadesSeleccionadas = [];
    $scope.discapacidadesSeleccionadasFormateadas = [];
    $scope.listadoDiscapacidades = [];
    $scope.buscador = '';
    $scope.grilla = [];

    //Multiselect Discapacidades
    $scope.multiselectConfig = { displayProp: 'nombre' };
    $scope.traduccionMultiselect = {
        buttonDefaultText: "Discapacidades",
        checkAll: "Seleccionar todos",
        uncheckAll: "Deseleccionar todos",
        dynamicButtonTextSuffix: "Seleccionadas"
    };
    $scope.eventosMultiselect = {
        onSelectionChanged: function () { 
          }
    };
    var cargarDiscapacidades = function () { // Trae Discapacidades del BE y las carga en lista
            var promesaDiscapacidades;
            var promiseDisc = DonacionesService.getDiscapacidades(); //TRAIGO LAS DISCAPACIDADES DEL BE
            promesaDiscapacidades = promiseDisc;
            promesaDiscapacidades.then(
                function (response) {
                    $scope.listadoDiscapacidades = response.data;
                }, function (error) {
                    $scope.listadoDiscapacidades = [];
                    Notification.error({ message: 'Ocurrio un error al cargar el listado de Discapacidades', delay: 3000, replaceMessage: true });
                });
    }; 

    $scope.$watch('discapacidadesSeleccionadas', function(){
            $scope.filtrar($scope.buscador);
        },true);

    $scope.init = function(){  //FUNCION INIT, ES EJECUTADA CUANDO SE CARGA EL CONTROLADOR. 
      var promise = DonacionesService.getDonaciones(); //TRAIGO LAS donaciones DEL BE
      cargarDiscapacidades();
      $scope.miPromesa = promise;
      $scope.miPromesa.then(
        function(response){         
          $scope.grilla = response.data;
          hayDonaciones = true;
        }, function(error) {
          $scope.grilla = [];
          Notification.error({message: 'Ocurrio un error al cargar las donaciones', delay: 3000,  replaceMessage: true});
        });
    };

    $scope.nuevaDonacion = function(){
        if ($rootScope.usuarioLogged == undefined) {
            $scope.visualizarModalLogIn();
        } else {
        var modalInstance = $uibModal.open({
            templateUrl: 'modules/donaciones/views/nueva-donacion.html',
            controller: 'NuevaDonacionController',
            size: 'lg'
            });
        }
    };


    $scope.filtrar = function(busqueda){  //METODO QUE FILTRA EL ARRAY LISTADO CUANDO modifico los DDL
      
      $scope.mensajeGrilla= 'Sugerencias para los mejores lugares ';
      formatearDiscapacidad();
      
      if (busqueda == '' && $scope.discapacidadesSeleccionadasFormateadas.length == 0) {
            $scope.init();
          }else {
            var promise = DonacionesService.buscarDonacionAvanzada(busqueda, $scope.discapacidadesSeleccionadasFormateadas);
            $scope.miPromesa = promise;
            $scope.miPromesa.then(
              function(response){
                $scope.grilla = response.data;
              }, function(error) {
                $scope.grilla = [];
                Notification.error({message: 'Ocurrio un error al cargar las donaciones', delay: 3000,  replaceMessage: true});
              });   
          }             
    };

    var formatearDiscapacidad = function() {
            $scope.discapacidadesSeleccionadasFormateadas = [];
            for (var i = 0; i < $scope.discapacidadesSeleccionadas.length; i++) {
                $scope.discapacidadesSeleccionadasFormateadas.push($scope.discapacidadesSeleccionadas[i].nombre);
            }
    };    

    $scope.visualizarModalDetalleDonacion = function(donacion){
        var modalInstance = $uibModal.open({
            templateUrl: 'modules/donaciones/views/visualizar-donacion.html',
            controller: 'VisualizarDonacionController',
            resolve: {
                donacion: function() {
                 return donacion;
               }
             },
            size: 'lg'
            });
    
    };

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
/*
    $scope.init();*/

});