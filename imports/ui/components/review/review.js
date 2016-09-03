/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './review.html';

class Review {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        document.title = "Review";

    }

}

const name = 'review';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: Review
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('review', {
        url: '/review',
        template: '<review></review>'
    });
}