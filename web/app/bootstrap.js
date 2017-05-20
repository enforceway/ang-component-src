require([
    'data/menu',
    'jquery',
    'angular',

    'routeApp',

    'moment',
    'fullcalendar',
    'angular-route',
    'angular-resource',
    'angular-sanitize',
    'angular-ui-calendar',

    'services/baseService'
],
function(menu, $, angular, routeApp) {
    'use strict';

    routeApp.module.requires.push(
        'ngResource',
        'ngSanitize',
        'ui.calendar'
    );
    routeApp.install(menu);
    angular.bootstrap(document, [routeApp.module.name]);
});
