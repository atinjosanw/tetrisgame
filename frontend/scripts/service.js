(function() {
    'use strict';

    angular
        .module('tetrisGame')
        .constant('baseURL', 'http://localhost:8080/');

    homeFactory.$inject = ['$resource', 'baseURL'];

    function homeFactory($resource, baseURL) {
        var homeFac = {};
        homeFac.getUser = getUser;

        function getUser() {
            var url = baseURL + 'users/';
            console.log($resource(url));
            return $resource(url).get().$promise;
        }

        return homeFac;
    }

    angular
        .module('tetrisGame')
        .factory('homeFactory', homeFactory);
})();
