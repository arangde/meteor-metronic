/**
 * Created by jaran on 7/6/2016.
 */
import { Mongo } from 'meteor/mongo';

export const Categories = new Mongo.Collection('categories');

Categories.allow({
    insert(userId, category) {
        return true;
    },
    update(userId, category, fields, modifier) {
        return true;
    },
    remove(userId, category) {
        return true; 
    }
});