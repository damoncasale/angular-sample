'use strict';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import uibootstrap from 'angular-ui-bootstrap';
import nganimate from 'angular-animate';
import ngcookies from 'angular-cookies';
import ngsanitize from 'angular-sanitize';
import pagination from 'angular-utils-pagination';
import nglocalstorage from 'angular-local-storage';
import ngfileupload from 'angular-file-upload';
import ngmoment from 'angular-moment';

import config from './app.config';
import routes from './app.routes';
import run from './app.run';

import {baseService, feedbackService, authService} from './shared/factories';
import {
    fbAdminDirective,
    fbAdminCtrl,
    fbViewCtrl,
    fbFeedbackDirective,
    fbFeedbackCtrl,
    fbLoginDirective,
    fbLoginCtrl
} from './components';

import './scss/base.scss';
import './scss/feedback.scss';

let lavasoft = angular
.module('lavasoft', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    //'appTemplates',
    'angularUtils.directives.dirPagination',
    'LocalStorageModule',
    'angularFileUpload',
    'angularMoment'
]);

console.log("ENV", API_URL);

lavasoft
.constant('ENV', { 'API_URL': API_URL })
.config(config)
.config(routes)
;

lavasoft
.factory('baseService', baseService)
.factory('feedbackService', feedbackService)
.factory('authService', authService)
;

lavasoft
.directive('fbAdmin', fbAdminDirective)
.controller('AdminCtrl', fbAdminCtrl)
.controller('ViewCtrl', fbViewCtrl)
.directive('fbFeedback', fbFeedbackDirective)
.controller('FeedbackCtrl', fbFeedbackCtrl)
.directive('fbLogin', fbLoginDirective)
.controller('LoginCtrl', fbLoginCtrl)
;

lavasoft
.run(run)
;
