'use strict';

config.$inject = ['$httpProvider', '$compileProvider'];

export default function config($httpProvider, $compileProvider) {

    // Angular perfs best practices
    $httpProvider.useApplyAsync(true);
    $compileProvider.debugInfoEnabled(false);
}
