/**
 * Created by jaran on 7/6/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { BaseVehicles } from '../basevehicles/';

export const Models = new Mongo.Collection('models');
const VehicleTypes = new Mongo.Collection('vehicletypes');

if (Meteor.isServer) {
    Meteor.publish('models', function(options, filter) {
        var selector = {};

        if(filter.year) {
            selector["YearID"] = filter.year;
        }
        if(filter.make) {
            selector["MakeID"] = filter.make.MakeID;
        }

        var baseVehicles = BaseVehicles.find(selector);
        var modelIds = [];
        baseVehicles.forEach(function(vehicle) {
            modelIds.push(vehicle.ModelID);
        });

        selector = {'ModelID': {"$in": modelIds}};

        const vehicleTypes = VehicleTypes.find({'VehicleTypeGroupID': 2}).fetch();
        const vehicleTypeIds = [];
        vehicleTypes.forEach(function(vehicleType) {
            vehicleTypeIds.push(vehicleType.VehicleTypeID);
        });

        selector['VehicleTypeID'] = {"$in": vehicleTypeIds};

        return Models.find(selector);
    });
}
