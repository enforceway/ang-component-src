define(['app-config/env'], function(env) {
    'use strict';

    return {
        baseUrl: 'app',
        deps: ['bootstrap'],
        bower: {
            baseUrl: '../../bower_components',
            extensions: 'js|css',
            ignore: 'requirejs|requirejs-domready|requirejs-text',
            auto: true,
            deps: ['dependencies'] // can add 'devDependencies' as well
        },
        paths: {
            'routeApp': 'model/routeApp',

            'angular': '../../bower_components/angular/angular',
            'angular-route' : '../../bower_components/angular-ui-router/release/angular-ui-router',
            'angular-resource' : '../../bower_components/angular-resource/angular-resource',
            'angular-mocks' : '../../bower_components/angular-mocks/angular-mocks',
            'angular-sanitize' : '../../bower_components/angular-sanitize/angular-sanitize',
            'ux-datepicker' : '../../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker',
            'angular-ui-calendar': '../../bower_components/angular-ui-calendar/src/calendar',
            'moment': '../../bower_components/moment/moment',
            'fullcalendar': '../../bower_components/fullcalendar/dist/fullcalendar',

            'jquery' : '../../bower_components/jquery/dist/jquery',
            'underscore' : '../../bower_components/underscore/underscore',


            'text': '../../bower_components/requirejs-text/text',
            'json': '../../bower_components/requirejs-plugins/src/json',
            'bower': '../../bower_components/requirejs-plugin-bower/src/bower'
        },
        shim: {
            'understore' : {
                exports: 'understore'
            },
            'angular': {
                exports: 'angular'
            },
            'jquery': {
                exports: 'jquery'
            },
            'angular-route': {
                deps:['angular'],
                exports: 'angular-route'
            },
            'angular-bootstrap-calendar': {
                deps: ['angular'],
                exports: 'angular-bootstrap-calendar'
            },
            'angular-resource': {
                deps:['angular'],
                exports: 'angular-resource'
            },
            'angular-mocks': {
                deps: ['angular']
            },
            'angular-sanitize': {
                deps:['angular'],
                exports: 'angular-sanitize'
            },
            'ux-datepicker': {
                deps: ['jquery'],
                exports: 'ux-datepicker'
            },
            'angular-ui-calendar': {
                deps: ['angular'],
                exports: 'angular-ui-calendar'
            }
        }
    };
});
