/**
 * Created by jaran on 7/18/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const LegacyVehicles = new Mongo.Collection('legacyvehicles');

if (Meteor.isServer) {
    Meteor.publish('legacyvehicles', function(options, filter) {
        const selector = {};

        if(filter.year) {
            selector["Year"] = filter.year;
        }
        // if(filter.make) {
        //     selector["Make"] = filter.make.toString();
        // }
        
        return LegacyVehicles.find(selector);
    });
}

export function getVehicleKeywords(vehicle) {
    return [ vehicle.Year, vehicle.Make, vehicle.Model, vehicle.Submodel ];
}