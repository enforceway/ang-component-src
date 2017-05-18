define([
    'require',
    '../app-config/env',
    'angular',
    'underscore'
], function(require, env, angular, _) {
    'use strict';

    var webApp = {
        install: install,
        module: angular.module(env.appName, ['ui.router'])
    };
    var fileNameReg = new RegExp('[^/]*$');
    var urlReg = new RegExp('/*');
    var fromReg = new RegExp('\\*$');


    function install(menuObj) {
        webApp.module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            setRoutes($stateProvider, $urlRouterProvider, menuObj.menu);
        }]);
    };
    function generateStateObj(item, parent) {
        return state;
    };
    function setRoutes($stateProvider, $urlRouterProvider, routesObj, parentRoute) {
        angular.forEach(routesObj, function(item) {
            if(item.directory) {
                var fileName = fileNameReg.exec(item.directory);
                var stateName = item.name;
                var url = '/' + (item.path || item.name).replace(urlReg, '');
                var from = typeof(item.from) === 'string' && '/' + item.from.replace(urlReg, '') || item.from;
                item.directory = item.directory.replace(urlReg, '');

                item.url = url;
                var stateObj = {
                    url: url,
                    text: item.text,
                    parent: parent || null,
                    params: item.params,
                    menu: item,
                    templateUrl: item.directory + '/' + fileName + '.html',
                    template: item.template,
                };

                if(item.template) {
                    delete stateObj.templateUrl;
                }



                // 有js加载的话
                if(item.hasJs !== false) {
                    stateObj.resolve = angular.extend(stateObj.resolve || {}, {
                        component: ['$q', function($q) {
                            var def = $q.defer();
                            require(['../' + item.directory + '/' + fileName], function(routeModule) {
                                webApp.currRoute = routeModule;
                                def.resolve();
                            }, function(err) {
                                def.resolve();
                            });
                            return def.promise;
                        }]
                    });
                }





                // state Object


                $stateProvider.state(item.name, stateObj);

                // 继续设置路由
                if(item.children && route.children.length) {
                    setRoutes(resolver, $stateProvider, $urlRouterProvider, route.children, stateObj);
                }
            }
        });
    };

    var app = webApp.module;
    app.config([
        '$compileProvider',
        '$provide',
        '$stateProvider',
        '$urlRouterProvider',
        '$controllerProvider',
        '$httpProvider',
        function($compileProvider, $provide, $stateProvider, $urlRouterProvider, $controllerProvider, $httpProvider) {
        //$sceDelegateProvider.resourceUrlWhitelist(['self', rxEnv.crossDomain()]);
        //ngClipProvider.setPath('./static/swf/ZeroClipboard.swf');
        // $urlRouterProvider.otherwise('local');
        $httpProvider.defaults.withCredentials = true;

        webApp.factory = $provide.factory;
        webApp.controller = $controllerProvider.register;
        webApp.directive = $compileProvider.directive;
        webApp.filter = $compileProvider.register;
        webApp.service = $provide.service;

    }]).run(function($rootScope) {
        $rootScope.$on('$stateNotFound', function(event, toState, toParams, fromState, fromParams) {
            console.log('notfound:', event, toState);
        });
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
            console.log('error:', event, toState);
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            console.log(toParams);
        });



        var lazyLayout = _.debounce(function(arg1, arg2, arg3) {
            if(webApp.currRoute && webApp.currRoute.install) {
                webApp.currRoute.install();
            }
        }, 200);
        $rootScope.$on('$viewContentLoaded', function(routeObj, ngViewCfg) {
            // 陆游对应模板记载完毕后运行
            lazyLayout(routeObj, ngViewCfg);
        });
    });



    app.controller('base-controller', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.appName = 'Requirejs Bower Plugin';

    }]);

    return webApp;
});
