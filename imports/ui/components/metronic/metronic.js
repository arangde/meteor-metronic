/**
 * Created by jaran on 9/2/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './metronic.html';
import { name as Navigation } from '../navigation/navigation';
import { name as FooterNav } from '../footerNav/footerNav';
import { name as Dashboard } from '../dashboard/dashboard';
import { name as Home } from '../home/home';
import { name as History } from '../history/history';
import { name as Report } from '../report/report';
import { name as Review } from '../review/review';
import { name as Meetings } from '../meetings/meetings';

class Bitkar {
    constructor($location, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        // analytics.logPageLoad($scope, $location.absUrl(), $location.path());
        //
        // this.layout = "default";
        //
        // var url = $location.path();
        // url = url.split('/');
        // if(url.length > 1 && url[1] == 'sitemap') {
        //     this.layout = "empty";
        // }
    }
}

const name = 'metronic';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    Dashboard,
    Home,
    History,
    Report,
    Review,
    Meetings,
    Navigation,
    FooterNav
])
// .service('analytics', [function($window) {
//     return {
//         logPageLoad: function (scope, absoluteUrl, locationPath) {
//             if (absoluteUrl.indexOf("bitkar.parts") > 0) {
//                 scope.$on('$viewContentLoaded', function(event) {
//                     console.log('tracked');
//                     $window._gaq.push(['_trackPageview', locationPath]);
//                 });
//             } else {
//                 console.log('not tracked', locationPath);
//             }
//         }
//     };
// }])
    .component(name, {
        template,
        controllerAs: name,
        controller: Bitkar
    }).config(config);

function config($locationProvider, $urlRouterProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/dashboard");
};