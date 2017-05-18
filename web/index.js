require(['config/require.config'], function(requireCfg) {
    requirejs.config(requireCfg);
    require(['bower!../../bower.json'], function() {
        require(['bootstrap']);
    });
});