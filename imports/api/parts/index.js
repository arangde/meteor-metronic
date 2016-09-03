/**
 * Created by jaran on 7/28/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Parts = new Mongo.Collection('mappedparts');

if (Meteor.isServer) {
    Meteor.publish('parts', function(options) {
        return Parts.find({ "PartID": options.partId });
    });
}
