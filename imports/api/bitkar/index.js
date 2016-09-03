/**
 * Created by jaran on 8/17/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var bitkarDB = new MongoInternals.RemoteCollectionDriver("mongodb://localhost/bitkar");

exports.CJFeeds = new Mongo.Collection("cj_feed", { _driver: bitkarDB });
exports.PJFeeds = new Mongo.Collection("pj_feed", { _driver: bitkarDB });
