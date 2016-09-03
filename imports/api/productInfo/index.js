/**
 * Created by jaran on 7/28/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const ProductInfo = new Mongo.Collection('productinfo');

if (Meteor.isServer) {
    Meteor.publish('productinfo', function() {

        return ProductInfo.find({});
    });
}
