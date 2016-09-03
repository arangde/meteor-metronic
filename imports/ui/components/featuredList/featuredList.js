/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import ngAnimate from 'angular-animate';
import angularMeteor from 'angular-meteor';

import template from './featuredList.html';
import { TopProducts } from '../../../api/topProducts';

class FeaturedList {
    constructor($stateParams, $scope, $reactive, $http) {
        'ngInject';

        $reactive(this).attach($scope);

        this.subscribe('topproducts', () => [{
                limit: 20
            }, { }
        ]);

        this.helpers({
            topProducts() {
                const options = {};

                return TopProducts.find(options);
            }
        });
    }
}


const name = 'featuredList';

// create a module
export default angular.module(name, [
    ngAnimate,
    angularMeteor
]).component(name, {
    template,
    controllerAs: name,
    controller: FeaturedList
});