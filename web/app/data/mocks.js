define([
    'routeApp',
    'G',
    'angular-mocks'
], function(routeApp, G) {
    function api(url) {
        return function(actualUrl){
            return actualUrl.indexOf(url) == -1;
        };
    };
    function wrap(data) {
        return {
            status: 1,
            msg: '',
            data: data
        };
    };
    routeApp.module.requires.push('ngMockE2E');
    routeApp.module.run(['$httpBackend', function($httpBackend) {
        $httpBackend.whenGET(api(G.api.getAllNames)).respond(wrap({
            status: 1,
            msg: '',
            data: [{
                name: 'girl',
                age: 10
            }, {
                name: 'boy',
                age: 110
            }]
        }));
    }]);
});
