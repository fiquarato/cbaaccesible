'use strict';

angular.module('Donaciones')
.controller('VisualizarDonacionController',
    function ($scope, DonacionesService, $uibModalInstance, Notification, donacion) {

        $scope.donacion = donacion;

        $scope.cancelar = function () {
            $uibModalInstance.dismiss('cancelar');
        };
});