/**
 * Created by jaran on 8/7/2016.
 */
import { Meteor } from 'meteor/meteor';
import async from 'async';
import { Products } from '../../imports/api/products';
import { ProductInfo } from '../../imports/api/productInfo';
import { ProductCount } from '../../imports/api/productCount';
import { Vendors } from '../../imports/api/vendors';

if(Meteor.isServer) {
    Meteor.methods({
        'removeSessions': function () {
            var now = new Date();
            var endTime = now.getTime();
            endTime -= 24 * 60 * 60 * 1000; // a day with milliseconds

            Products.remove({lastActivity: null});
            var counts = Products.remove({lastAvtivity: {$lt: endTime}});
            console.log(counts, "products removed");

            ProductInfo.remove({lastActivity: null});
            counts = ProductInfo.remove({lastAvtivity: {$lt: endTime}});
            console.log(counts, "products info removed");

            ProductCount.remove({lastActivity: null});
            counts = ProductCount.remove({lastAvtivity: {$lt: endTime}});
            console.log(counts, "products count removed");
        },

        'updateVendors': function() {
            const pjVendors = [ "Auto Parts Warehouse", "JC Whitney" ];
            const cjVendors = [
                "4 Wheel Drive Hardware",
                "Advance Auto Parts",
                "AutoBarn.com",
                "Banggood CJ Affiliate Program",
                "BuyAutoParts.com",
                "eEuroparts.com",
                "Sixity Powersports and Auto Parts",
                "AliExpress by Alibaba.com",
                "AutoZone"
            ];
            Vendors.find().forEach(function (vendor) {
                vendor.key = vendor.name.replace(/[^a-zA-Z]/g, " ").trim().replace(/ /g, "-").replace(/--/g, "-").toLowerCase();
                if(pjVendors.indexOf(vendor.name) !== -1) {
                    vendor.feed = "pjfeed";
                }
                else if(cjVendors.indexOf(vendor.name) !== -1) {
                    vendor.feed = "cjfeed";
                }
                else {
                    vendor.feed = "";
                }
                Vendors.update({_id: vendor._id}, {"$set": {"key": vendor.key, "feed": vendor.feed}}, {multi:false, upsert:false});
            });
        },

        'findLocal': function(options) {
            var now = new Date(), productsCount = 0;
            async.series([
                function(callback) {
                    Products.find({}, {sort: {lastActivity: -1}, limit: 200}).forEach(function (lastProduct) {
                        lastProduct.sessionId = options.sessionId;
                        lastProduct.lastActivity = now.getTime();
                        delete lastProduct._id;

                        Products.insert(lastProduct);
                        productsCount++;
                    });
                    callback();
                },
                function(callback) {
                    ProductCount.insert({
                        sessionId: options.sessionId,
                        total: { totalEntries:productsCount, pageNumber:1 },
                        lastActivity: now.getTime()
                    });
                    callback();
                }
            ]);
        }
    });
}