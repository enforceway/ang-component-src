define(['routeApp', 'services/baseService'], function(routeApp) {
    'use strict';

    routeApp.service('homeService', ['httpService', function(httpService) {
        return {
            queryItems: function() {

            }
        };
    }]);
});
