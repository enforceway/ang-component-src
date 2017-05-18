define(['routeApp', 'data/menu'], function(app, menu) {
    'use strict';
    function _error() {};

    app.service('httpService', ['$q', '$http', function($q, $resource) {
        return {
            post: function(url, urlParam, param, callback) {
                if(!callback) {
                    callback = param;
                    param = urlParam;
                    urlParam = {};
                }
                if(typeof(param) === 'function') {
                    callback = param;
                    param = {};
                }
                $resource(url).save(urlParam, param, callback, _error);
            },
            put: function(url, urlParam, param, callback) {
                if(!callback) {
                    callback = param;
                    param = urlParam;
                    urlParam = {};
                }
                if(typeof(param) === 'function') {
                    callback = param;
                    param = {};
                }
                $resource(url, null, {
                    put: {
                        method: "PUT"
                    }
                }).put(urlParam, param, callback, _error);
            },
            delete: function(url, urlParam, param, callback) {
                if(!callback) {
                    callback = param;
                    param = urlParam;
                    urlParam = {};
                }
                if(typeof(param) === 'function') {
                    callback = param;
                    param = {};
                }
                $resource(url).delete(urlParam, param, callback, _error);
            },
            get: function(url, param, callback) {
                if(!callback) {
                    callback = param;
                    param = {};
                }
                $resource(url, param).query(callback, _error);
            }
        };
    }]);

    app.service('restHttpService', ['$q', '$resource', function($q, $resource) {
        return {
            post: function(url, urlParam, param, callback) {
                if(!callback) {
                    callback = param;
                    param = urlParam;
                    urlParam = {};
                }
                if(typeof(param) === 'function') {
                    callback = param;
                    param = {};
                }
                $resource(url).save(urlParam, param, callback, _error);
            },
            put: function(url, urlParam, param, callback) {
                if(!callback) {
                    callback = param;
                    param = urlParam;
                    urlParam = {};
                }
                if(typeof(param) === 'function') {
                    callback = param;
                    param = {};
                }
                $resource(url, null, {
                    put: {
                        method: "PUT"
                    }
                }).put(urlParam, param, callback, _error);
            },
            delete: function(url, urlParam, param, callback) {
                if(!callback) {
                    callback = param;
                    param = urlParam;
                    urlParam = {};
                }
                if(typeof(param) === 'function') {
                    callback = param;
                    param = {};
                }
                $resource(url).delete(urlParam, param, callback, _error);
            },
            get: function(url, param, callback) {
                if(!callback) {
                    callback = param;
                    param = {};
                }
                $resource(url, param).query(callback, _error);
            }
        };
    }]);
});
