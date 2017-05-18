define(['data/menu', 'routeApp'], function(menu, app) {
    'use strict';

    var _me = angular.noop;
    app.module.constant('resolver', {
        me: function() {
            return _me();
        }
    });

    app.module.run(function($http) {
        _me = function() {
            return true;
        }
    });
});
