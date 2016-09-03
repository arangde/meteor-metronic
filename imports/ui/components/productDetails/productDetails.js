/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { EJSON } from 'meteor/ejson';

import template from './productDetails.html';
import { ProductInfo } from '../../../api/productInfo';

class ProductDetails {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        this.itemId = $stateParams.itemId;
        this.vendor = $stateParams.vendor;

        console.log("sessionId", BitKarSession.sessionId);

        Meteor.call('getItemInfo', this.itemId, this.vendor, BitKarSession.sessionId, function(error, result) {
            if (error) {
                console.error(error, 'Error detected on getItemInfo');
            } else {

            }
        });

        this.subscribe('productinfo', () => [{sessionId: BitKarSession.sessionId}]);

        this.helpers({
            productInfo() {
                var ids = [$stateParams.itemId];
                if($stateParams.itemId/1 == parseInt($stateParams.itemId)) {
                    ids.push(parseInt($stateParams.itemId));
                }

                var product = ProductInfo.findOne({
                    itemId: { "$in": ids }
                });

                if(product)
                    document.title = product.title + " || BitKar Parts";

                return product;
            }
        });
    }

    description() {
        var description = this.productInfo.description;

        setTimeout(function() {
            $(".need-decode").each(function() {
                $(this).html(nl2br(description));
                $(this).show();
            });
        }, 500);

        return '';
    }
}

const name = 'productDetails';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: ProductDetails
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('productDetails', {
        url: '/products/:vendor/:title/:itemId/',
        template: '<product-details></product-details>'
    });
}