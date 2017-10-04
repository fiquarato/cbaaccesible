'use strict';
angular.module('Eventos', ['uiGmapgoogle-maps']) //DEFINO CONTROLADOR PARA EVENTO
    .controller('PrincipalEventosController',
    function ($scope, EventosService, $confirm, $filter, $uibModal, $anchorScroll, $location, Notification, $rootScope) {

        //Variables Scope
        $scope.buscador = '';
        $scope.discapacidades = [];
        $scope.listado = []; // Listado de Eventos que se muestra en la pagina

        $scope.listadoEventosFuturos = [];
        $scope.listadoEventosPasados = [];

        $scope.markersPasados = [];
        $scope.markersFuturos = [];

        $scope.listadoDiscapacidades = [];
        $scope.discapacidadesSeleccionadas = [];
        $scope.discapacidadesSeleccionadasFormateadas = [];
        $scope.mensajeLista = 'Sugerencias para los mejores Eventos ';

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

        // CALENDARIO
     /*   $scope.fechaDesde = moment().format('DD/MM/YYYY');
        $scope.fechaHasta = moment().add(29, 'days').format('DD/MM/YYYY');
      */
        $scope.fechaHasta = '';
        $scope.fechaDesde = '';

            
        $scope.$watch('discapacidadesSeleccionadas', function(){
            $scope.filtrar($scope.buscador, $scope.discapacidadesSeleccionadasFormateadas, $scope.fechaDesde, $scope.fechaHasta);
        },true);

        $scope.datePicker = {};
        $scope.datePicker.date = {startDate: null, endDate: null};
        $scope.calendarOptions = { //
            applyClass: 'btn-green',
            alwaysShowCalendars: true, // Desactivar para que no se muestre siempre el calendario
            autoApply: true, // Desactivar para que no se aplique automaticamente
            opens: "right",
            locale: {
              applyLabel: "Aceptar",
              fromLabel: "Desde",
              format: "DD-MM-YYYY",          
              toLabel: "Hasta",
              cancelLabel: 'Cancelar',
              customRangeLabel: 'Ingresa un Rango',
              applyClass: 'btn-green',
              daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
              firstDay: 1,
              monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
                  'Octubre', 'Noviembre', 'Diciembre'
              ]
            },
            ranges: {
                'Hoy': [moment(), moment()],
                'Mañana': [moment().add(1, 'days'), moment().add(1, 'days')],
                'Próximos 7 Días': [moment(), moment().add(6, 'days')],
                'Próximos 15 Días': [moment(), moment().add(14, 'days')],
                'Próximos 30 Días': [moment(), moment().add(29, 'days')],
                'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                'Próximos Mes': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
            },
            eventHandlers: {'apply.daterangepicker': function() {
                $scope.fechaDesde = $scope.datePicker.date.startDate.format('DD/MM/YYYY');
                $scope.fechaHasta = $scope.datePicker.date.endDate.format('DD/MM/YYYY');
                $scope.filtrar($scope.buscador, $scope.discapacidadesSeleccionadasFormateadas, $scope.fechaDesde, $scope.fechaHasta);
              
            }}
        };          

        // MAPA ... 
        var hayEventos = false;
        var busquedaLength = 0;
        var idShowingMouseOver = null;
        var idShowingClick = null;
        var arrayMarkers = [];
        $scope.markers = [];

        $scope.map = {
            center: { latitude: -31.41, longitude: -64.19 }, zoom: 12,
            markersEvents: {
                click: function (marker, eventName, model) {
                    $scope.showWindowClick(marker, eventName, model);
                },
                mouseover: function (marker, eventName, model) {
                    $scope.showWindowMouseOver(marker, eventName, model);
                },
                mouseout: function (marker, eventName, model) {
                    $scope.showWindowMouseLeave(marker, eventName, model);
                }
            }
        };

        $scope.loadMarkers = function () {   //MARCA LOS PUNTOS EN EL MAPA DEL ARRAY LISTADO
            var aux;
            var auxFuturos = 0;
            var auxPasados = 0;
            var auxMarkers, icons;
            $scope.markers = [];
            $scope.markersFuturos = [];

            for (var i = 0; i < $scope.listado.length; i++) {
                
                if (!$scope.listado[i].finalizado) {
                    auxFuturos++;
                    auxMarkers = auxFuturos;
                    icons = '/images/map_marker64.ico';
                } else {
                    auxPasados++;
                    auxMarkers = auxPasados;
                    icons = '/images/map-markerRED.ico';
                }
                
                if($scope.listado[i].direccion!=null){

                    if (i >= 9) { aux = '7 38' } else { aux = '3 38' };

                    
                    var ret = {
                        id: $scope.listado[i].id,
                        latitude: $scope.listado[i].direccion.latitud,
                        longitude: $scope.listado[i].direccion.longitud,
                        title: $scope.listado[i].nombre,
                        descripcion: $scope.listado[i].direccion.calle + ' ' + $scope.listado[i].direccion.numero,
                        icon: icons,
                        options: {
                            labelContent: auxMarkers,
                            labelAnchor: aux
                        },
                    };
                    if (!$scope.listado[i].finalizado) {
                        $scope.markersFuturos.push(ret);
                    } else {
                        $scope.markersPasados.push(ret);
                    }
                    
                } 
                
            };
            $scope.markers = $scope.markersFuturos;
        };

        $scope.showWindowClick = function (marker, eventName, model) {

            if (idShowingClick) {
                var tohide = $filter('filter')($scope.markers, { id: idShowingClick })[0];
                tohide.show = false;
                var div = $('#anchorSon'+idShowingClick);
                div.css('backgroundColor', '');
                div.children("*").children("*").children("*").css('color', '');
                div.children("*").children("*").children("*").children("*").css('color', '');
            }
            idShowingClick = marker.key;
            model.show = true;

            var location = $location.hash();
            $location.hash('anchor' + model.id);
            $anchorScroll.yOffset = 60;
            $anchorScroll();
            $location.hash(location);
            var div = $('#anchorSon'+idShowingClick);
            div.css('backgroundColor', '#337ab7');
            div.children("*").children("*").children("*").css('color', 'white');
            div.children("*").children("*").children("*").children("*").css('color', 'white');

            $scope.$apply();
        };

        $scope.showWindowMouseOver = function (marker, eventName, model) {
            if (idShowingClick) {
                var toShow = $filter('filter')($scope.markers, { id: idShowingClick })[0];
                toShow.show = true;
                $scope.$apply();
                if (idShowingClick === marker.key) {
                    return;
                }
            }
            if (idShowingMouseOver && idShowingMouseOver !== idShowingClick) {
                var tohide = $filter('filter')($scope.markers, { id: idShowingMouseOver })[0];
                tohide.show = false;
            }
            idShowingMouseOver = marker.key;
            model.show = true;
        };

        $scope.showWindowMouseLeave = function (marker, eventName, model) {

            if (marker.key == idShowingMouseOver && marker.key !== idShowingClick) {
                var tohide = $filter('filter')($scope.markers, { id: idShowingMouseOver })[0];
                tohide.show = false;
            }
            $scope.$apply();
        };

        $scope.showWindowMouseClickLeftNav = function (idMarker) {

            if (idShowingClick) {
                var tohide = $filter('filter')($scope.markers, { id: idShowingClick })[0];
                tohide.show = false;

                var div = $('#anchorSon'+idShowingClick);
                div.css('backgroundColor', '');
                div.children("*").children("*").children("*").css('color', '');
                div.children("*").children("*").children("*").children("*").css('color', '');
            }
            if (idShowingClick !== idMarker) {
                var marker = $filter('filter')($scope.markers, { id: idMarker })[0];
                idShowingClick = marker.id;
                marker.show = true;
                var div = $('#anchorSon'+idMarker);
                div.css('backgroundColor', '#337ab7');
                div.children("*").children("*").children("*").css('color', 'white');
                div.children("*").children("*").children("*").children("*").css('color', 'white');
            }
            else {
                idShowingClick = null;
                var div = $('#anchorSon'+idMarker);
                div.css('backgroundColor', '');
                div.children("*").children("*").children("*").css('color', '');
                div.children("*").children("*").children("*").children("*").css('color', '');

            }
        };

        $scope.showWindowMouseOverLeftNav = function (idMarker) {
            if (idShowingMouseOver) {
                var tohide = $filter('filter')($scope.markers, { id: idShowingMouseOver })[0];
                tohide.show = false;
            }
            var marker = $filter('filter')($scope.markers, { id: idMarker })[0];
            idShowingMouseOver = marker.id;
            marker.show = true;
            if (idShowingClick) {
                var toShow = $filter('filter')($scope.markers, { id: idShowingClick })[0];
                toShow.show = true;
            }
        };

        $scope.hideWindowsMouseLeave = function (idMarker) {
            if (idMarker == idShowingMouseOver && idMarker !== idShowingClick) {
                var marker = $filter('filter')($scope.markers, { id: idMarker })[0];
                marker.show = false;
            }
        }

        // Metodos
        var cargarDiscapacidades = function () { // Trae Discapacidades del BE y las carga en lista
            var promesaDiscapacidades;
            var promiseDisc = EventosService.getDiscapacidades(); //TRAIGO LAS DISCAPACIDADES DEL BE
            promesaDiscapacidades = promiseDisc;
            promesaDiscapacidades.then(
                function (response) {
                    $scope.listadoDiscapacidades = response.data;
                }, function (error) {
                    $scope.listadoDiscapacidades = [];
                    Notification.error({ message: 'Ocurrio un error al cargar el listado de Discapacidades', delay: 3000, replaceMessage: true });
                });
        };

        var formatearDiscapacidad = function() {
            $scope.discapacidadesSeleccionadasFormateadas = [];
            for (var i = 0; i < $scope.discapacidadesSeleccionadas.length; i++) {
                $scope.discapacidadesSeleccionadasFormateadas.push($scope.discapacidadesSeleccionadas[i].nombre);
            }
        };

        $scope.mostrarEventosPasados = function() {
            if($scope.flagShowEvents){
                $scope.flagShowEvents = false;
                $scope.markers = $scope.markersFuturos;
            }else {
                $scope.flagShowEvents = true;   
                //$scope.markers.concat($scope.markersPasados); 
            }
            
        };

        var generarListaEventosPasados = function() {
            $scope.listadoEventosPasados= [];
            $scope.listadoEventosFuturos= [];
            
           
            for(var i = 0; i < $scope.listado.length; i++) {
                if (!$scope.listado[i].finalizado) {
                    $scope.listadoEventosFuturos.push($scope.listado[i]);
                }else if ($scope.listado[i].finalizado) {
                         $scope.listadoEventosPasados.push($scope.listado[i]);
                }
            }
        };

        var generarFlag = function () {
            if ($scope.listadoEventosFuturos.length == 0 && $scope.listadoEventosPasados.length > 0 ) {
                $scope.flagShowEvents = true;
            } else {
                $scope.flagShowEvents = false;
            }
        };

        var cargarEventos = function () { //Trae Eventos del BE
            var promesaEventos;
            var promiseDisc = EventosService.getEventos(); //TRAIGO LOS EVENTOS APROBADOS DEL BE
            promesaEventos = promiseDisc;
            promesaEventos.then(
                function (response) {
                    $scope.listado = response.data;
                    hayEventos = true;
                    generarListaEventosPasados();
                    generarFlag();
                    $scope.cargaImagenesEntidad();
                    $scope.loadMarkers();
                },
                function (error) {
                    $scope.listado = [];
                    Notification.error({
                        message: 'Ocurrio un error al cargar el listado de Eventos',
                        delay: 3000,
                        replaceMessage: true
                    });
                });
           
        };
        $scope.cargaImagenesEntidad = function(){
              var aux = [];
              for (var i = 0; i < $scope.listado.length; i++) { 
                for (var x = 0; x < $scope.listado[i].listaTiposDiscapacidad.length; x++) {
                  if ($scope.listado[i].listaTiposDiscapacidad[x].nombre == 'Visual') {
                    aux[x] = { "url" : "images/ciego.png",
                               "tooltip" : "Visual"} ;            ;

                  } else if ($scope.listado[i].listaTiposDiscapacidad[x].nombre == 'Motriz') {
                      aux[x] = { "url" : "images/silla-de-ruedas.png",
                               "tooltip" : "Motriz"} ;

                    } else if ($scope.listado[i].listaTiposDiscapacidad[x].nombre == 'Lenguaje') {
                        aux[x] = { "url" : "images/señas.jpg_64x64.png",
                               "tooltip" : "Lenguaje"} ;

                      } else if ($scope.listado[i].listaTiposDiscapacidad[x].nombre == 'Auditiva') {
                          aux[x] = { "url" : "images/deaf.png_64x64.png",
                               "tooltip" : "Auditiva"} ;

                        }
                          else if ($scope.listado[i].listaTiposDiscapacidad[x].nombre == 'Mental') {
                            aux[x] = { "url" : "images/cerebro.png",
                               "tooltip" : "Mental"} ;

                          }
                }
                $scope.listado[i].listaImagenesDiscapacidad = aux;
                aux= [];
              }
            };

        $scope.filtrar = function( texto, discapacidades, fechaDesde, fechaHasta ){
            formatearDiscapacidad();
            if (texto == '' && $scope.discapacidadesSeleccionadasFormateadas.length == 0 && fechaDesde == '' && fechaHasta == '') {
                iniciar();
            } else {
                var promise = EventosService.buscarEventoAvanzada(texto,$scope.discapacidadesSeleccionadasFormateadas,fechaDesde,fechaHasta);
                $scope.miPromesa = promise;
                $scope.miPromesa.then(
                  function(response){
                    $scope.listado = response.data;
                    generarListaEventosPasados();
                    generarFlag();
                    $scope.cargaImagenesEntidad();
                    $scope.loadMarkers();
                  }, function(error) {
                    $scope.listado = [];
                    Notification.error({message: 'Ocurrio un error al cargar las entidades', delay: 3000,  replaceMessage: true});
                  });
            }

        };

        var iniciar = function () { // Metodos que se ejecutan cuando ingresamos al modulo de Eventos
            cargarDiscapacidades();
            cargarEventos();
        };

        $scope.abrirModalNuevoEvento = function () {
            if ($rootScope.usuarioLogged == undefined) {
                $scope.visualizarModalLogIn();
            }else {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'modules/eventos/views/nuevoEvento.html',
                        controller: 'NuevoEventoController',
                        size: 'lg' //'lg' para large, 'md' para medium y 'sm' para small
                    });   
            }
        };

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


        // Ejecucion de Metodos inciales
        iniciar();

    });

    // Controlador para visualizar Lugar
  angular.module('Eventos')
    .controller('VisualizarEventoController',
        function ($scope, EventosService, $uibModalInstance, Notification, evento) {

            $scope.evento = evento;

            $scope.cancelar = function () {
                $uibModalInstance.dismiss('cancelar');
            };

    });

    angular.module('Eventos')
    .controller('NuevoEventoController',
        function ($scope, EventosService, $uibModalInstance, Upload, Notification,  $uibModal, $rootScope) {

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
            
            $scope.fechaInicioSeleccionada = function(){
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

            $scope.quitarFechaFin = function(){
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
                smartButtonTextConverter: function(itemText, originalItem) { 
                    return itemText;
                }
            };
            $scope.traduccionMultiselectORG = {
                buttonDefaultText: "Organizaciones",
                searchPlaceholder: "Buscar...",
                dynamicButtonTextSuffix : "seleccionado"
            };            

            $scope.eventosMultiselectORG = {
                onSelectionChanged: function () {
                    $scope.nuevoEvento.organizador = $scope.organizacionSeleccionada[0];
                }
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
                              url: 'https://cbaaccesible.herokuapp.com/serviceevento/uploadimageprofile',
                              fields: {'idEvento': response.data.id}, // additional data to send
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