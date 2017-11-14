'use strict';

angular.module('Entidad')
    .controller('EntidadAddUpdateController',
    function ($scope, EntidadService, $uibModalInstance, Upload, Notification, entidades, init, entidad, $rootScope) {

        $scope.options = {
            componentRestrictions: { country: 'AR' }
        };

        $scope.entidades = entidades;// Verificar si es neesario. !!!!!??????
        $scope.init = init;
        $scope.nuevaEntidad; // Aca se cargan los datos del formulario

        // Inicializacion de Tabs Para el Formulario    
        $scope.tab = 1;
        $scope.mostrarBtnAnterior = false;
        $scope.mostrarBtnSiguiente = true;

        // Discapacidades 
        $scope.listadoDiscapacidades = []; //ACA SE CARGA LA LISTA DEL CHECKBOX
        $scope.discapacidadesSeleccionadas = []; //ACA SE GUARDAN LAS DISCAPACIDADES SELECCIONADAS

        //Categorias - Acordion y listas controladoras
        $scope.listadoCategoriasSubcategorias = [];
        $scope.subCategoriasSeleccionadas = [];
        var allCategorias = [];
        var allSubcategorias = [];

        // LISTADO DE METODOS DEL CONTROLADOR!!!!!!

        //Controladores del TAB
        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
            mostrarBotones();
        };
        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };
        $scope.anteriorTab = function () {
            if ($scope.tab > 1) {
                $scope.tab = $scope.tab - 1;
            }
            mostrarBotones();
        };
        $scope.siguienteTab = function () {
            if ($scope.tab < 3) {
                $scope.tab = $scope.tab + 1;
            }
            mostrarBotones();
        };
        var mostrarBotones = function () { // Controla cuando se muestran los botones Anterior y siguiente

            if ($scope.tab == 1) {
                $scope.mostrarBtnAnterior = false;
                $scope.mostrarBtnSiguiente = true;
            } else if ($scope.tab == 3) {
                $scope.mostrarBtnAnterior = true;
                $scope.mostrarBtnSiguiente = false;
            } else {
                $scope.mostrarBtnAnterior = true;
                $scope.mostrarBtnSiguiente = true;
            }
        };

        // Metodos controladores de Discapacidades
        var cargarListadoDiscapacidades = function () { // Trae Discapacidades del BE y las carga en lista
            var promesaDiscapacidades;
            var promiseDisc = EntidadService.getDiscapacidades(); //TRAIGO LAS DISCAPACIDADES DEL BE
            promesaDiscapacidades = promiseDisc;
            promesaDiscapacidades.then(
                function (response) {
                    $scope.listadoDiscapacidades = response.data;
                }, function (error) {
                    $scope.listadoDiscapacidades = [];
                    Notification.error({ message: 'Ocurrio un error al cargar el listado de Discapacidades', delay: 3000, replaceMessage: true });
                });
        };

        $scope.seleccionarDiscapacidad = function (disc) {
            console.log(disc);
            var flag = false;
            var imagen = $('#image' + disc.id);
            for (var i = 0; i < $scope.discapacidadesSeleccionadas.length; i++) {
                if ($scope.discapacidadesSeleccionadas[i] == disc) {
                    imagen.children("*").removeClass('imagen-seleccionada');
                    $scope.discapacidadesSeleccionadas.splice(i, 1);
                    flag = true;
                }
            }
            if (!flag) {
                $scope.discapacidadesSeleccionadas.push(disc);
                imagen.children("*").addClass('imagen-seleccionada');
            }


        };

        // Categorias - Subcategorias Metodos controladores   
        var obtenerCategorias = function () {
            var promesaCategorias;
            var promiseCategorias = EntidadService.getCategorias(); //TRAIGO LAS CATEGORIAS DEL BE
            promesaCategorias = promiseCategorias;
            promesaCategorias.then(
                function (response) {
                    allCategorias = response.data;
                    obtenerSubcategorias(); // Cuando se terminan de cargar las cartegorias, llamo a las subcstegorias
                }, function (error) {
                    allCategorias = [];
                    Notification.error({ message: 'Ocurrio un error al cargar las Categorias y Subcategorias', delay: 3000, replaceMessage: true });
                });
        };

        var obtenerSubcategorias = function (id) {
            var promesaSubcategoria;
            var promiseSubcategorias = EntidadService.getSubcategorias(); //TRAIGO LAS SUBCATEGORIAS DEL BE
            promesaSubcategoria = promiseSubcategorias;
            promesaSubcategoria.then(
                function (response) {
                    allSubcategorias = response.data;
                    armarListaCategoriaSubcategoria(); // CUANDO TERMINO DE CARGAR LAS SUBCATEGORIAS, LLAMO AL METODO DE ARMAR LISTADO
                }, function (error) {
                    allSubcategorias = [];
                    Notification.error({ message: 'Ocurrio un error al cargar las Categorias y Subcategorias', delay: 3000, replaceMessage: true });
                });
        };

        var armarListaCategoriaSubcategoria = function () { //Aca armo listado Categoria/subcategoria para el acordion

            for (var in1 = 0; in1 < allCategorias.length; in1++) {
                var cat = allCategorias[in1];
                cat.subcategorias = [];

                for (var in2 = 0; in2 < allSubcategorias.length; in2++) {
                    var subc = allSubcategorias[in2];
                    if (cat.id == subc.categoriaOrg.id) {
                        cat.subcategorias.push(subc);
                    }
                }
                $scope.listadoCategoriasSubcategorias.push(cat);
            }
        };

        var iniciar = function () {
            cargarListadoDiscapacidades(); // LLAMO AL SERVICIO DE CARGAR DISCAPACIDADES
            obtenerCategorias(); // TRAIGO Categorias, subcategorias y armo lista para Acordion

            // if(entidad){
            //   $scope.nuevaEntidad = entidad;
            //   $scope.nuevaEntidad.nombre = ($scope.nuevaEntidad.nombre);
            //   $scope.nuevaEntidad.direccion = ($scope.nuevaEntidad.calle);
            //   $scope.nuevaEntidad.numeroDireccion = ($scope.nuevaEntidad.numeroCalle);

            // } else {
            //   $scope.nuevaEntidad = {
            //     nombre: null,
            //     descripcion: null
            //   };
            // }
        };

        $scope.validarCreacion = function (formulario) { // Valida que el formulario este correcto y que haya al menos una discapacidad y una subcategoria

            if (formulario == true) {
                if ($scope.discapacidadesSeleccionadas.length > 0) {//Hay al menos una discapacidad?
                    if ($scope.subCategoriasSeleccionadas.length > 0) {//Hay al menos una subcategoria?
                        crearEntidad();
                    } else {
                        alert("Seleccione al menos una Subcategoria");
                        $scope.tab = 3;
                    }
                } else {
                    alert("Seleccione al menos una Discapacidad");
                    $scope.tab = 2;
                }
            }
        };



        var crearEntidad = function () {

            $scope.nuevaEntidad.listaTiposDiscapacidad = $scope.discapacidadesSeleccionadas; // Aca le indico las discapacidades que seleccione
            $scope.nuevaEntidad.listaSubCategorias = $scope.subCategoriasSeleccionadas;
            $scope.nuevaEntidad.direccion.lugar = $scope.place.name;
            var miPromesa = EntidadService.crearEntidad($scope.nuevaEntidad);
            miPromesa.then(
                function (response) {
                    Upload.upload({
                        url:  $rootScope.organizacionService + 'uploadimageprofile',
                        fields: { 'idOrganizacion': response.data.id }, // additional data to send
                        file: $scope.logo
                    });
                    $scope.cancelar();
                    $scope.init();

                    Notification.success({ message: 'La entidad se creó correctamente', delay: 3000 });
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

        // Metodos iniciados al principio
        iniciar();
    });