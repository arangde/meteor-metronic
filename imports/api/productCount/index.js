/**
 * Created by jaran on 7/28/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const ProductCount = new Mongo.Collection('productcount');

if (Meteor.isServer) {
    Meteor.publish('productcount', function(filter, options) {
        if(options.vendor) {
            filter.vendor = options.vendor;
        }

        return ProductCount.find(filter);
    });
}
