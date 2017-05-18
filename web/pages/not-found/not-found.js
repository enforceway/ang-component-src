define(['routeApp'], function(routeApp) {
    'use strict';

    routeApp.controller('notFoundCtrl', ['$scope', function($scope) {
        $scope.str = "这个页面从地球上消失了"
    }]);

});