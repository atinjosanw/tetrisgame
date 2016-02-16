(function () {
    'use strict';

    angular
    .module('tetrisGame')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['homeFactory'];
    function HomeController (homeFactory) {
        var vm = this;
        vm.id = undefined;
        vm.message = "Loading...";
        vm.user = undefined;
        vm.login = login;

        function login() {
            if (!vm.user) {
                homeFactory.getUser()
                .then(function (res) {
                    vm.user = res;
                }, function (err) {
                    vm.message = "You have to login."
                });
            }
        }

        console.log(vm.id===undefined);
    }

    angular
    .module('tetrisGame')
    .controller('FootController', FootController);

    function FootController () {
    }

    angular
    .module('tetrisGame')
    .controller('LobbyController', LobbyController);

    function LobbyController () {
    }


    angular
    .module('tetrisGame')
    .controller('RoomController', RoomController)

    function RoomController () {
    }

})();
