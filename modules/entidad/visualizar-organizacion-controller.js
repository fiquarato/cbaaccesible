'use strict';

angular.module('Entidad')
    .controller('VisualizarLugarController',
    function ($scope, EntidadService, $uibModalInstance, Notification, entidades, init, entidad) {

        $scope.lugar = entidad;

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancelar');
        };

    });