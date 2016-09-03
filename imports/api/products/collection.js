/**
 * Created by jaran on 7/6/2016.
 */
import { Mongo } from 'meteor/mongo';

export const Products = new Mongo.Collection('products');

Products.allow({
    insert(userId, product) {
        return true; //userId && product.owner === userId;
    },
    update(userId, product, fields, modifier) {
        return true; //userId && product.owner === userId;
    },
    remove(userId, product) {
        return true; //userId && product.owner === userId;
    }
});