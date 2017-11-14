'use strict';

angular.module('Eventos')
    .controller('NuevoEventoController',
    function ($scope, EventosService, $uibModalInstance, Upload, Notification, $uibModal, $rootScope) {

        $scope.options = {
            componentRestrictions: { country: 'AR' }
        };

        $scope.nuevoEvento = {};
        $scope.listadoDiscapacidades = [];
        $scope.discapacidadesSeleccionadas = [];
        $scope.organizaciones = [];
        $scope.organizacionSeleccionada = [];
        $scope.verFinalizacion = false;
        $scope.dt = null;
        $scope.selInicio = false;
        $scope.dt2 = null;
        $scope.selFinalizacion = false;
        $scope.format = "dd/MM/yyyy";
        $scope.format2 = "dd/MM/yyyy";
        $scope.hstep = 1;
        $scope.mstep = 15;

        //Datepicker1

        $scope.today = function () {
            $scope.dt = new Date();
            $scope.dt.setHours(12);
            $scope.dt.setMinutes(0);
        };

        $scope.inlineOptions = {
            minDate: new Date(),
            showWeeks: true,
        };

        $scope.dateOptions = {
            showWeeks: false,
            formatYear: 'yyyy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

        $scope.fechaInicioSeleccionada = function () {
            $scope.selInicio = true;
            $scope.dateOptions2.minDate = $scope.dt;
            $scope.dt2 = $scope.dt;

        };

        //Datepicker 2 

        $scope.today2 = function () {
            $scope.dt2 = new Date();
            $scope.dt2.setHours(12);
            $scope.dt2.setMinutes(0);
        };

        $scope.inlineOptions2 = {
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions2 = {
            showWeeks: false,
            formatYear: 'yyyy',
            maxDate: new Date(2050, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };


        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.popup2 = {
            opened: false
        };

        // TIMEPICKER 1

        $scope.mytime = new Date();
        $scope.mytime.setHours(12);
        $scope.mytime.setMinutes(0);

        $scope.changed = function () { // actualiza cuando cambia time picker Inicio
            $scope.dt.setHours($scope.mytime.getHours());
            $scope.dt.setMinutes($scope.mytime.getMinutes());
        };

        // TIMEPICKER 2

        $scope.mytime2 = new Date();
        $scope.mytime2.setHours(12);
        $scope.mytime2.setMinutes(0);

        $scope.changed2 = function () { // actualiza cuando cambia time picker finalizacion
            $scope.dt2.setHours($scope.mytime2.getHours());
            $scope.dt2.setMinutes($scope.mytime2.getMinutes());
        };

        //Multiselect Discapacidades
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
                $scope.nuevoEvento.listaTiposDiscapacidad = $scope.discapacidadesSeleccionadas;
            }
        };

        $scope.mostrarFinalizacion = function () {
            $scope.verFinalizacion = !$scope.verFinalizacion;
        };

        $scope.quitarFechaFin = function () {
            $scope.selFinalizacion = false;
            $scope.verFinalizacion = false;
            $scope.dt2 = $scope.dt;
        };

        // Multiselect Organizacion

        $scope.multiselectORGConfig = {
            displayProp: 'nombre',
            selectionLimit: 1,
            showCheckAll: false,
            showUncheckAll: false,
            buttonClasses: 'btn btn-success',
            dynamicTitle: true,
            closeOnSelect: true,
            searchField: 'nombre',
            enableSearch: true,
            styleActive: true,
            smartButtonMaxItems: 1,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            }
        };
        $scope.traduccionMultiselectORG = {
            buttonDefaultText: "Organizaciones",
            searchPlaceholder: "Buscar...",
            dynamicButtonTextSuffix: "seleccionado"
        };

        $scope.eventosMultiselectORG = {
            onSelectionChanged: function () {
                $scope.nuevoEvento.organizador = $scope.organizacionSeleccionada[0];
            }
        };

        $scope.visualizarModalLogIn = function () { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
            var modalInstance = $uibModal.open({
                templateUrl: 'modules/log-in/views/log-in.html',
                controller: 'LogInController',
                resolve: {
                    init: function () {
                        return $scope.init;
                    }
                },
                size: 'sm' //'lg' para large, 'md' para medium y 'sm' para small
            });
        };

        var cargarOrganizaciones = function () {

            var promesaOrganizaciones;
            var promiseOrg = EventosService.getOrganizaciones(); //TRAIGO LAS DISCAPACIDADES DEL BE
            promesaOrganizaciones = promiseOrg;
            promesaOrganizaciones.then(
                function (response) {
                    $scope.organizaciones = response.data;
                },
                function (error) {
                    $scope.organizaciones = [];

                    Notification.error({
                        message: 'Ocurrio un error al cargar el listado de Orgaizaciones',
                        delay: 3000,
                        replaceMessage: true
                    });
                }
            );
        };

        var cargarDiscapacidades = function () { // Trae Discapacidades del BE y las carga en lista
            var promesaDiscapacidades;
            var promiseDisc = EventosService.getDiscapacidades(); //TRAIGO LAS DISCAPACIDADES DEL BE
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
        };

        $scope.validarCreacion = function (formulario) { // Valida que el formulario este correcto y que haya al menos una discapacidad.
            //No imppementado todavia
            crearEvento();
        };

        var crearEvento = function () {

            var momIn = moment($scope.dt);
            var momFn = moment($scope.dt2);

            $scope.nuevoEvento.fechaInicio = momIn.format("HH:mm DD/MM/YYYY");
            $scope.nuevoEvento.fechaFin = momFn.format("HH:mm DD/MM/YYYY");

            var miPromesa = EventosService.cargarEvento($scope.nuevoEvento);
            miPromesa.then(
                function (response) {

                    Upload.upload({
                        url: $rootScope.eventosService + 'uploadimageprofile',
                        fields: { 'idEvento': response.data.id }, // additional data to send
                        file: $scope.logo
                    });
                    $scope.cancelar();
                    Notification.success({
                        message: 'El Evento se creó correctamente',
                        delay: 3000
                    });
                },
                function (error) {
                    if (error.data.message) {
                        Notification.error({
                            message: error.data.message,
                            delay: 3000
                        });
                    } else {
                        Notification.error({
                            message: 'Ocurrio un error al cargar el Evento',
                            delay: 3000
                        });
                    }
                });

        };

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancelar');
        };

        //Metodos que se ejecutan al abrir el modal
        $scope.today();
        $scope.today2();
        cargarDiscapacidades();
        cargarOrganizaciones();
    });