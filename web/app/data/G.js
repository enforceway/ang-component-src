define(['../app-config/env'], function(env) {
    var hostsPath = {
        'default-sit': 'http://localhost:8080',
        'default-uat': 'http://localhost:8080',
        'default-prod': 'http://localhost:8080',
        'getHost': function(param) {
            return this[param + '-' + env.name];
        }
    };
    var G = {
        api: {
            getAllNames: hostsPath.getHost('default') + '/getNameList'
        }
    };
    return G;
});
