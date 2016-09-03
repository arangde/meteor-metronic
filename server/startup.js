/**
 * Created by jaran on 7/6/2016.
 */
import { Meteor } from 'meteor/meteor';
// import { Categories } from '../imports/api/categories';
// import { Products } from '../imports/api/products';
// import { LegacyVehicles } from '../imports/api/legacyvehicles';
// import { EngineLegacies } from '../imports/api/enginelegacies';
// import { Parts } from '../imports/api/parts';
// import { CJFeeds, PJFeeds } from '../imports/api/bitkar';
// import { Vendors } from '../imports/api/vendors';
const AccessLogs = new Mongo.Collection('accesslogs');

Meteor.startup(() => {

    if(Meteor.server) {

        Meteor.onConnection(function(conn) {
            var now = new Date();
            AccessLogs.insert({
                lastActivity: now.getTime(),
                clientAddress: conn.clientAddress,
                httpHeaders: conn.httpHeaders,
                dateTime: now
            });
        });
    }

    if(Meteor.isClient) {
        jQuery(document).ready(function() {
            // Metronic.init(); // init metronic core componets
            // Layout.init(); // init layout
            // Demo.init(); // init demo(theme settings page)
            // Index.init(); // init index page
            // Tasks.initDashboardWidget(); // init tash dashboard widget
        });
    }

});
