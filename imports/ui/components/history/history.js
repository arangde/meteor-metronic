/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './history.html';

class History {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        document.title = "History";

    }

}

const name = 'history';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: History
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('history', {
        url: '/history',
        template: '<history></history>'
    });
}