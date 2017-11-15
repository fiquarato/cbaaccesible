'use strict';

angular.module('Entidad', ['uiGmapgoogle-maps']) //DEFINO CONTROLADOR PARA ENTIDAD
.controller('EntidadController',
  function ($scope, EntidadService, $confirm, $filter, $uibModal, $anchorScroll, $location, Notification, $rootScope) {

    $scope.searchTermBusqueda= '';
    $scope.searchTermDiscapacidad= '';
    $scope.searchTermCategoria= '';
    $scope.mensajeLista= 'Sugerencias para las mejores organizaciones ';

    var hayEntidades = false;
    var busquedaLength = 0;
    var idShowingMouseOver = null;
    var idShowingClick = null;

    $scope.miPromesa;

    $scope.map = { center: { latitude: -31.41, longitude: -64.19 }, zoom: 12,
    markersEvents: {
      click: function(marker, eventName, model) {
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

    $scope.init = function(){  //FUNCION INIT, ES EJECUTADA CUANDO SE CARGA EL CONTROLADOR. 
      var promise = EntidadService.getEntidades(); //TRAIGO LAS ENTIDADES DEL BE
      $scope.miPromesa = promise;
      $scope.miPromesa.then(
        function(response){         
          $scope.listado = response.data;
          $scope.cargaImagenesEntidad();
          hayEntidades = true;
          $scope.loadMarkers();
        }, function(error) {
          $scope.listado = [];
          Notification.error({message: 'Ocurrio un error al cargar las entidades', delay: 3000,  replaceMessage: true});
        });
    };

    $scope.init();

    var arrayMarkers = [];
    $scope.markers = [];

    $scope.loadMarkers = function(){   //MARCA LOS PUNTOS EN EL MAPA DEL ARRAY LISTADO
      var aux;  
      var arrayMarkers = [];
      $scope.markers = [];
      for (var i = 0; i < $scope.listado.length; i++) { 
        if (i >= 9) {aux = '7 38'} else {aux= '3 38'};
        var ret = {
          id: $scope.listado[i].id,
          latitude: $scope.listado[i].direccion.latitud,
          longitude: $scope.listado[i].direccion.longitud,
          title: $scope.listado[i].nombre,
          descripcion: $scope.listado[i].direccion.calle + ' ' + $scope.listado[i].direccion.numero,
          icon:'https://fiquarato.github.io/cbaaccesible/images/map_marker64.ico',
          options: {
            labelContent: i+1,
            labelAnchor: aux
          },

        };
        arrayMarkers.push(ret);
      };
      $scope.markers = arrayMarkers;
    };
    
    $scope.showWindowClick = function (marker, eventName, model) {

      if(idShowingClick){
        var tohide=$filter('filter')($scope.markers,{id:idShowingClick})[0];
        tohide.show = false;
        var div = $('#anchorSon'+idShowingClick);
        quitarSeleccionItem(div);
      }
      idShowingClick = marker.key;
      model.show = true;

      var location = $location.hash();
      $location.hash('anchorSon'+model.id);
      $anchorScroll.yOffset = 60;
      $anchorScroll();
      $location.hash(location);
      var div = $('#anchorSon'+idShowingClick);
      seleccionarItem(div);
      
      $scope.$apply();
    };

    $scope.showWindowMouseOver = function (marker, eventName, model) {
      if(idShowingClick){
        var toShow=$filter('filter')($scope.markers,{id:idShowingClick})[0];
        toShow.show = true;
        $scope.$apply();
        if(idShowingClick === marker.key){
          return;
        }
      }
      if(idShowingMouseOver && idShowingMouseOver !== idShowingClick){
        var tohide=$filter('filter')($scope.markers,{id:idShowingMouseOver})[0];
        tohide.show = false;
      }
      idShowingMouseOver = marker.key;
      model.show = true;
    };

    $scope.showWindowMouseLeave = function (marker, eventName, model) {

      if(marker.key == idShowingMouseOver && marker.key !== idShowingClick){
        var tohide=$filter('filter')($scope.markers,{id:idShowingMouseOver})[0];
        tohide.show = false;
      }
      $scope.$apply();
    };

    var quitarSeleccionItem = function(div) {
        div.css('backgroundColor', '');
        div.children("*").children("*").css('color', '');
        div.children("*").children("*").children("*").css('color', '');
        div.children("*").children("*").children("*").children("*").css('color', '');
    };

    var seleccionarItem = function(div) {
        div.css('backgroundColor', '#337ab7');
        div.children("*").children("*").css('color', 'white');
        div.children("*").children("*").children("*").css('color', 'white');
        div.children("*").children("*").children("*").children("*").css('color', 'white');
    }

    $scope.showWindowMouseClickLeftNav = function (idMarker) {

      if(idShowingClick){
        var tohide=$filter('filter')($scope.markers,{id:idShowingClick})[0];
        tohide.show = false;
        var div = $('#anchorSon'+idShowingClick);
        quitarSeleccionItem(div);
      }
      if(idShowingClick !== idMarker){
        var marker=$filter('filter')($scope.markers,{id:idMarker})[0];
        idShowingClick = marker.id;
        marker.show = true;
        var div = $('#anchorSon'+idMarker);
        seleccionarItem(div);
      }
      else{
        idShowingClick = null;
        var div = $('#anchorSon'+idMarker);
        quitarSeleccionItem(div);
        
      }
    };

    $scope.showWindowMouseOverLeftNav = function (idMarker) {
      if(idShowingMouseOver){
        var tohide=$filter('filter')($scope.markers,{id:idShowingMouseOver})[0];
        tohide.show = false;
      }
      var marker=$filter('filter')($scope.markers,{id:idMarker})[0];
      idShowingMouseOver = marker.id;
      marker.show = true;
      if(idShowingClick){
        var toShow=$filter('filter')($scope.markers,{id:idShowingClick})[0];
        toShow.show = true;
      }
    };

    $scope.hideWindowsMouseLeave = function (idMarker) {
      if(idMarker == idShowingMouseOver && idMarker !== idShowingClick){
        var marker=$filter('filter')($scope.markers,{id:idMarker})[0];
        marker.show = false;
      }
    }

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


   

    $scope.filtrar = function(busqueda, discapacidad, categoria){  //METODO QUE FILTRA EL ARRAY LISTADO CUANDO modifico los DDL
      
      $scope.mensajeLista= 'Sugerencias para los mejores lugares ';
      
      if (discapacidad == null || discapacidad == '') { 
        discapacidad = '';
        }else {
          $scope.mensajeLista += 'del tipo de discapacidad "' + discapacidad + '"';
        }

      if (categoria == null || categoria == '') {
         categoria = '' ;
         }else {
          $scope.mensajeLista += ' de la categoria "' + categoria + '"';
         }

      if (busqueda == null || busqueda == '') { 
        busqueda = '';
        }else {
          $scope.mensajeLista += ' para la busqueda de "' + busqueda + '"';
        }
          if (busqueda == '' && categoria == '' && discapacidad == '') {
            $scope.init();
          }else {
            var promise = EntidadService.buscarEntidadAvanzada(busqueda, discapacidad, categoria);
            $scope.miPromesa = promise;
            $scope.miPromesa.then(
              function(response){
                $scope.listado = response.data;
                $scope.cargaImagenesEntidad();
                $scope.loadMarkers();
              }, function(error) {
                $scope.listado = [];
                Notification.error({message: 'Ocurrio un error al cargar las entidades', delay: 3000,  replaceMessage: true});
              });   
          }             
    };        

    // No se esta usando
    // $scope.eliminar = function(entidad) {  //ELIMINA LA ENTIDAD QUE SE REQUIERE POR JSON
    //   var index = $scope.listado.indexOf(entidad);
    //   if (index > -1) {
    //     $confirm({text: "¿Esta seguro que desea eliminar a " + entidad.nombre + " de las entidades?", 
    //       title: 'Eliminar Entidad', 
    //       ok: 'Si', 
    //       cancel: 'No'})
    //     .then(function() {
    //       var promise = EntidadService.eliminarEntidad(entidad.id);
    //       promise.then(
    //         function(response){
    //           $scope.listado.splice(index, 1);
    //           Notification.success({message: 'La entidad se eliminó correctamente', delay: 3000});
    //         }, function(error) {
    //           Notification.error({message: 'Se produjo un error al eliminar la entidad', delay: 3000});
    //         });
    //     });
    //   }
    // };

    $scope.openAddUpdateModal = function(entidad) { //SE ABRE EL MODAL PARA ACTUALIZAR UNA ENTIDAD
      
      if ($rootScope.usuarioLogged == undefined) {
        $scope.visualizarModalLogIn();
      }else {
      var modalInstance = $uibModal.open({
        templateUrl: 'modules/entidad/views/addupdateentidad.html',
        controller: 'EntidadAddUpdateController',
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
      }
    };

    $scope.visualizarModalLugarDiscapacidad = function(entidad) { //SE ABRE EL MODAL PARA VISUALIZAR UN LUGAR
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