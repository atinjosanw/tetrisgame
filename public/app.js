(function() {
    'use strict';

    angular
        .module('tetrisGame', [
            'ui.router'
        ])
        .config(config);

    function config ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header' : {
                        templateUrl: 'views/header.html'
                    },
                    'content' : {
                        templateUrl: 'views/home.html',
                        controller : 'HomeController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            .state('app.lobby', {
                url: 'lobby',
                views: {
                    'content@': {
                        templateUrl: 'views/lobby.html',
                        controller: 'LobbyController'
                    }
                }
            })
            .state('app.room', {
                url: 'lobby/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/room.html',
                        controller: 'RoomController'
                    }
                }
            });
            $urlRouterProvider.otherwise('/');
    }

})();
