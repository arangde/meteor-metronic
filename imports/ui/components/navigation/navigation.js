/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

const name = 'navigation';

// create a module for navigation
export default angular.module(name, [
    angularMeteor
]).component(name, {
    template,
    controllerAs: name
});
