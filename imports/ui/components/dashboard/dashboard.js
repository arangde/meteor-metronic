/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { EJSON } from 'meteor/ejson';

import template from './dashboard.html';

class Dashboard {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        document.title = "Dashboard";
    }

}

const name = 'dashboard';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: Dashboard
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        template: '<dashboard></dashboard>'
    });
}