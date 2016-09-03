/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './meetings.html';

class Meetings {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        document.title = "Meetings";

    }

}

const name = 'meetings';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: Meetings
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('meetings', {
        url: '/meetings',
        template: '<meetings></meetings>'
    });
}