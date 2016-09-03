/**
 * Created by jaran on 7/18/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { LegacyVehicles } from '../legacyvehicles';

export const EngineLegacies = new Mongo.Collection('enginelegacy');

if (Meteor.isServer) {
    Meteor.publish('enginelegacies', function(options, filter) {
        var selector = {};

        if(filter.year) {
            selector["Year"] = filter.year;
        }
        if(filter.make) {
            selector["Make"] = filter.make;
        }
        if(filter.model) {
            selector["Model"] = filter.model;
        }
        console.error(selector);

        var engineLegacyIds = [];

        LegacyVehicles.find(selector).forEach(function(legacyVehicle) {
            if(engineLegacyIds.indexOf(legacyVehicle.EngineLegacyID) === -1) {
                engineLegacyIds.push(legacyVehicle.EngineLegacyID);
            }
        });

        if(engineLegacyIds.length) {
            return EngineLegacies.find({"EngineLegacyID": {"$in": engineLegacyIds}});
        }
        else {
            this.ready();
        }
    });
}
