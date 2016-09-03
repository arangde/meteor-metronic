/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';

import templateHome from './home.html';
import templateServices from './services.html';
import template404 from './404.html';
import templateTerms from './terms.html';
import templatePrivacy from './privacy.html';

class Pages {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        this.helpers({

        });
    }

}

const name = 'pages';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    uiBootstrap
]).config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        // .state('home', {
        //     url: '/',
        //     template: templateHome,
        //     controller: Pages
        // })
        .state('services', {
            url: '/services',
            template: templateServices,
            controller: Pages
        })
        .state('terms', {
            url: '/terms-of-use',
            template: templateTerms,
            controller: Pages
        })
        .state('privacy', {
            url: '/privacy',
            template: templatePrivacy,
            controller: Pages
        })
        .state('404', {
            url: '/404',
            template: template404,
            controller: Pages
        });
}