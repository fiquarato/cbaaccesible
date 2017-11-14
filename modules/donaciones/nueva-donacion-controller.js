'use strict';

angular.module('Donaciones').controller('NuevaDonacionController',
function ($scope, DonacionesService, Upload, $uibModalInstance, Notification, $uibModal, $rootScope) {

    $scope.nuevaDonacion = {};

    $scope.listadoDiscapacidades = [];
    $scope.discapacidadesSeleccionadas = [];
    $scope.nuevaDonacion.fechaFinalizacion = new Date();
    $scope.nuevaDonacion.fechaFinalizacion.setDate($scope.nuevaDonacion.fechaFinalizacion.getDate()+5);
    var dt = moment($scope.nuevaDonacion.fechaFinalizacion);
    $scope.nuevaDonacion.fechaFinalizacion = dt.format("HH:mm DD/MM/YYYY");

    //Multiselect de Discapacidades
    $scope.multiselectConfig = {
        displayProp: 'nombre',
    };
    $scope.traduccionMultiselect = {
        buttonDefaultText: "Discapacidades",
        checkAll: "Seleccionar todos",
        uncheckAll: "Deseleccionar todos",
        dynamicButtonTextSuffix: "Seleccionadas"
    };
    $scope.eventosMultiselect = {
        onSelectionChanged: function () {
            $scope.nuevaDonacion.listaTiposDiscapacidad = $scope.discapacidadesSeleccionadas;
        }
    };

 
    // Metodos
    var cargarDiscapacidades = function () { // Trae Discapacidades del BE y las carga en lista
        var promesaDiscapacidades;
        var promiseDisc = DonacionesService.getDiscapacidades(); //TRAIGO LAS DISCAPACIDADES DEL BE
        promesaDiscapacidades = promiseDisc;
        promesaDiscapacidades.then(
            function (response) {
                $scope.listadoDiscapacidades = response.data;
            },
            function (error) {
                $scope.listadoDiscapacidades = [];
                Notification.error({
                    message: 'Ocurrio un error al cargar el listado de Discapacidades',
                    delay: 3000,
                    replaceMessage: true
                });
            });
    }


    $scope.validarCreacion = function(valido){

        crearNuevaDonacion();

    };

    var crearNuevaDonacion = function(){
        $scope.nuevaDonacion.listaTiposDiscapacidad = $scope.discapacidadesSeleccionadas; // Aca le indico las discapacidades que seleccione
        $scope.nuevaDonacion.usuario = $rootScope.usuarioLogged;
        var miPromesa = DonacionesService.crearDonacion($scope.nuevaDonacion);
        miPromesa.then(
            function (response) {
                Upload.upload({
                    url: $rootScope.donacionesService + 'uploadimageprofile',
                    fields: { 'idDonacion': response.data.id }, // additional data to send
                    file: $scope.logo
                });
                $scope.cancelar();

                Notification.success({ message: 'La donacion se creó correctamente', delay: 3000 });
            }, function (error) {
                if (error.data.message) {
                    Notification.error({ message: error.data.message, delay: 3000 });
                } else {
                    Notification.error({ message: 'Ocurrio un error al cargar las entidades', delay: 3000 });
                }
            });

    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss('cancelar');
    };

    cargarDiscapacidades();
});