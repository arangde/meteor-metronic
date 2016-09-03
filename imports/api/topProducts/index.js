/**
 * Created by jaran on 7/28/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const TopProducts = new Mongo.Collection('topproducts');

if (Meteor.isServer) {
    Meteor.publish('topproducts', function(options) {

        return TopProducts.find({"imageURL":{$exists:true}}, options);
    });
}
