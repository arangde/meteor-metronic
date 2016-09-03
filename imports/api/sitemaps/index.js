/**
 * Created by jaran on 8/2/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Counts } from 'meteor/tmeasday:publish-counts';

export const Sitemaps = new Mongo.Collection('sitemaps');

if (Meteor.isServer) {
    Meteor.publish('sitemaps', function(options, filter) {
        if(filter.dir == 'categories') {
            options = {};
        }

        Counts.publish(this, 'numberOfSitemaps', Sitemaps.find(filter), {
            noReady: true
        });

        return Sitemaps.find(filter, options);
    });
}
