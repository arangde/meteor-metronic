/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './report.html';

class Report {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        document.title = "Report";

    }

}

const name = 'report';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: Report
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('report', {
        url: '/report',
        template: '<report></report>'
    });
}