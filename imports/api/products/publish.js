/**
 * Created by jaran on 7/6/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Products } from './collection';
// import { Categories } from '../categories';

// var CategoryModel = require('../categories/model');

if (Meteor.isServer) {
    Meteor.publish('products', function(options, filter) {
        const selector = {};

        // if (filter.searchText && filter.searchText.length) {
        //     selector.title = {
        //         $regex: `.*${filter.searchText}.*`,
        //         $options : 'i'
        //     };
        // }
        //
        // if (filter.categoryId) {
        //     // check(filter.categoryId, String);
        //     var categoryIds = CategoryModel.getCategoryIds(filter.categoryId);
        //     selector['primaryCategory.categoryId'] = {"$in": categoryIds};
        // }
        //

        if (filter.priceSort) {
            if(parseInt(filter.priceSort) == 1) {
                options.sort = { price: 1 };
            }
            else if(parseInt(filter.priceSort) == 2) {
                options.sort = { price: -1 };
            }
            else {

            }
        }

        if (filter.vendorFilter) {
            selector.vendor = filter.vendorFilter;
        }

        if (filter.sessionId) {
            selector.sessionId = filter.sessionId;
        }

        Counts.publish(this, 'numberOfProducts', Products.find(selector), {
            noReady: true
        });

        return Products.find(selector, options);
    });
}