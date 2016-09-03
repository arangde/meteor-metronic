/**
 * Created by jaran on 8/12/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Vendors = new Mongo.Collection('vendors');

exports.getVendorKey = function (name) {
    var vendor = Vendors.findOne({name: name});
    if(vendor) {
        return vendor.key;
    }
    return "_";
}

exports.getVendorFeed = function (key) {
    var vendor = Vendors.findOne({key: key});
    if(vendor) {
        return vendor.feed;
    }
    return "";
}

exports.getVendorName = function (key) {
    var vendor = Vendors.findOne({key: key});
    if(vendor) {
        return vendor.name;
    }
    return "";
}

exports.Vendors = Vendors;

if (Meteor.isServer) {
    Meteor.publish('vendors', function() {

        return Vendors.find({}, {sort: {name: 1}});
    });
}
