/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './footerNav.html';

const name = 'footerNav';

// create a module for footer
export default angular.module(name, [
    angularMeteor
]).component(name, {
    template,
    controllerAs: name
});