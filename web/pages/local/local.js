define([
    'routeApp',
    'G',
    'moment',
    'angular-ui-calendar',
    ''
], function(routeApp, G) {
    'use strict';

    routeApp.controller('localCtrl', ['$scope', 'httpService', function($scope, httpService) {

        $scope.str = "this is local page";
        $scope.eventSources = [];
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };
        $scope.getAllNames = function() {

            httpService.get(G.api.getAllNames, function(data) {
                console.log(data);
            });
        };
        $scope.getAllNames();

    }]);

});