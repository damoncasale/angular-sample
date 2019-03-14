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

import './shared/factories';
import './components';

lavasoft
.config(config)
.config(routes)
.run(run);
