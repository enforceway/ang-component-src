define([
    'jquery',
    'routeApp',
    'ux-datepicker',
    '../home/home-service',
], function($, routeApp) {
    'use strict';

    routeApp.controller('homeCtrl', ['$timeout', '$scope', 'homeService', function($timeout, $scope, homeService) {
        $scope.str = "this is home page";
        $scope.test = "enforceway";
        // $scope.$$postDigest(function() {
        //     $('#sandbox-container .input-daterange').datepicker({
        //         autoclose: true,
        //         todayHighlight: true
        //     });
        // });
    }]);
    return {
        install: function() {
            $('#sandbox-container .input-daterange').datepicker({
                autoclose: true,
                todayHighlight: true
            });
        }
    };

});
