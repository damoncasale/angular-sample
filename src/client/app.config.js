(function() {
  'use strict';

  angular
    .module('lavasoft')
    .config(config);

  config.$inject = ['$httpProvider', '$compileProvider'];

  function config($httpProvider, $compileProvider) {

    // Angular perfs best practices
    $httpProvider.useApplyAsync(true);
    $compileProvider.debugInfoEnabled(false);
  }
})();
