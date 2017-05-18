define(['routeApp', 'data/menu'], function(app, menu) {
    'use strict';
    function _error() {};

    app.service('session', ['$q', '$http', function($q, $resource) {
        var session = {
            getLoginInfo: function() {

            }
        };
        return session;
    }]);
});
