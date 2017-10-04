'use strict';

// declare modules
angular.module('Entidad', []);
angular.module('Eventos', []);
angular.module('Moderacion', []);


angular.module('Home', []);
angular.module('LogIn', []);
angular.module('Registracion', []);
var app = angular.module('CbaAccesibleApp', [
    'Entidad',
    'Eventos',
    'Home',
    'Moderacion',
    'LogIn',
    'Registracion',
    'ngRoute',
    'ngCookies',
    'infinite-scroll',
    'ui.bootstrap',
    'angular-confirm',
    'ui-notification',
    'angularjs-dropdown-multiselect',
    'jcs-autoValidate',
    'checklist-model',
    'daterangepicker',
    'vsGoogleAutocomplete',
    'ngFileUpload'
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

app.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        //SERVICE URL LOCAL
        $rootScope.tipoDiscapacidadService = 'https://cbaaccesible.herokuapp.com/servicetipodiscapacidad/';
        $rootScope.categoriasService = 'https://cbaaccesible.herokuapp.com/servicecategorialugar/';
        $rootScope.subCategoriasService = 'https://cbaaccesible.herokuapp.com/servicesubcategorialugar/';

        // Service URL LOCAL -- EVENTOS
        $rootScope.eventosService = 'https://cbaaccesible.herokuapp.com/serviceevento/';

        $rootScope.organizacionService = 'https://cbaaccesible.herokuapp.com/serviceorganizacion/';

        //service url local para log-in y registracion
        $rootScope.logInService = 'https://cbaaccesible.herokuapp.com/serviceusuario/';
        $rootScope.registracionService = 'https://cbaaccesible.herokuapp.com/serviceusuario/';

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};

        //determinamos usuario anonimo al iniciar la app
        $rootScope.usuarioLogged = undefined;
        
        //Comentar para subir al master
        //$rootScope.usuarioLogged = {"id":1,"email":"admin@admin.com","pass":"admin","persona":null,"tipoUsuario":"MODERADOR"};


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