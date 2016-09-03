/**
 * Created by jaran on 7/6/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { BaseVehicles } from '../basevehicles/';

export const Makes = new Mongo.Collection('makes');

if (Meteor.isServer) {
    Meteor.publish('makes', function(options, filter) {
        const selector = {};
        
        if(filter.year) {
            var baseVehicles = BaseVehicles.find({"YearID": filter.year});
            var makeIds = [];
            baseVehicles.forEach(function(vehicle) {
                makeIds.push(vehicle.MakeID);
            });
            selector['MakeID'] = {"$in": makeIds};
        }

        return Makes.find(selector);
    });
}
