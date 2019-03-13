(function() {
  'use strict';

  angular
    .module('lavasoft')
    .run(run);

  run.$inject = ['$rootScope', '$state', '$timeout', 'authService'];

  function run($rootScope, $state, $timeout, authService) {

    $rootScope
    .$on('$stateChangeStart',function(e, toState) {
        $rootScope.pageTransition = true;
        // eslint-disable-next-line no-console
        console.log('Changing to: %s', toState.name);
    });
    $rootScope
    .$on('$stateChangeError', function(e, toState) {
        if (toState.name !== 'login') {
            $timeout(function() {
                // eslint-disable-next-line no-console
                console.log('Redirecting to login');
                $state.go('login');
            });
        }
    });
    $rootScope
    .$on('$stateChangeSuccess',function(e, toState) {
        // eslint-disable-next-line no-console
        console.log('$stateChangeSuccess: %s', toState.name);
        if (!authService.isAuthenticated()) {
            authService.fillAuthDataFromCache();
        }
        if (('undefined' !== typeof toState.data) &&
            ('undefined' !== typeof toState.data.redirectIfAuthed) &&
            toState.data.redirectIfAuthed &&
            authService.isAuthenticated()) {
            e.preventDefault();
            $timeout(function() {
                // eslint-disable-next-line no-console
                console.log('Redirecting to admin');
                $state.go('admin');
            });
        } else if (('undefined' !== typeof toState.data) &&
            ('undefined' !== typeof toState.data.requireAuth) &&
            toState.data.requireAuth &&
            !authService.isAuthenticated()) {
            e.preventDefault();
            $timeout(function() {
                // eslint-disable-next-line no-console
                console.log('Not authenticated, redirecting to login');
                $state.go('login');
            });
        } else {
            // eslint-disable-next-line no-console
            console.log('All checks passed');
            $rootScope.pageTransition = false;
        }
    })
    ;
  }
})();
