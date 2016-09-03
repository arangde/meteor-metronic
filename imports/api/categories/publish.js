/**
 * Created by jaran on 7/6/2016.
 */
import { Meteor } from 'meteor/meteor';

import { Categories } from './collection';

if (Meteor.isServer) {
    Meteor.publish('categories', function(options, searchString) {
        const selector = {
            /*'CategoryLevel' : {$in: ['3', '4']}*/
        };

        return Categories.find(selector, options);
    });
}