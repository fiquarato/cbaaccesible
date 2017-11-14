'use strict';

angular.module('Eventos')
.controller('VisualizarEventoController',
    function ($scope, EventosService, $uibModalInstance, Notification, evento) {

        $scope.evento = evento;

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancelar');
        };
});