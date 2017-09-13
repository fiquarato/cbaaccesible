'use strict';

// declare modules
angular.module('Entidad', []);
angular.module('Eventos', []);
angular.module('Moderacion', []);

var app = angular.module('CbaAccesibleApp', [
    'Entidad',
    'Eventos',
    'Home',
    'Moderacion',
    'ngRoute',
    'ngCookies',
    'infinite-scroll',
    'ui.bootstrap',
    'angular-confirm',
    'ui-notification',
    'angularjs-dropdown-multiselect',
    'jcs-autoValidate',
    'checklist-model',
    'daterangepicker'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/entidades', {
            controller: 'EntidadController',
            templateUrl: 'modules/entidad/views/entidad.html'
        })
        .when('/eventos', {
            controller: 'PrincipalEventosController',
            templateUrl: 'modules/eventos/views/principal-eventos.html'
        })
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .when('/moderacion', {
            controller: 'ModeracionController',
            templateUrl: 'modules/moderacion/views/moderacion.html'
        })
        .otherwise({ redirectTo: '/home' });
}]);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAZWZiCR_N7b05aQRHyQg2e08t_pX50N-I',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})

app.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        //SERVICE URL LOCAL
        $rootScope.entidadService = 'https://cbaaccesible.herokuapp.com/servicelugar/';
        $rootScope.tipoDiscapacidadService = 'https://cbaaccesible.herokuapp.com/servicetipodiscapacidad/';
        $rootScope.categoriasService = 'https://cbaaccesible.herokuapp.com/servicecategorialugar/';
        $rootScope.subCategoriasService = 'https://cbaaccesible.herokuapp.com/servicesubcategorialugar/';

        // Service URL LOCAL -- EVENTOS
        $rootScope.eventosService = 'https://cbaaccesible.herokuapp.com/serviceevento/';

        $rootScope.organizacionService = 'https://cbaaccesible.herokuapp.com/serviceorganizacion/';

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};

    }]);

app.filter('solofecha', function () {
    return function (fecha) {
        var unaFecha = moment( fecha , "hh:mm DD/MM/YYYY");        
        return unaFecha.format("DD/MM/YYYY");
    };
})

.filter('solohora', function () {
    return function (fecha) {
        var unaFecha = moment( fecha , "hh:mm DD/MM/YYYY");        
        return unaFecha.format("HH:mm");
    };
})