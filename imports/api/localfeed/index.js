/**
 * Created by jaran on 8/28/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Match } from 'meteor/check';
import { EJSON } from 'meteor/ejson';
import { getVendorKey, getVendorName } from '../vendors';
import { getSEOUrl } from '../include';
import { CJFeeds, PJFeeds } from '../bitkar';

var LocalFeedApi = {

    formatPJData: function (data) {
        var spaces = data.replace("_", " ");
        var periods = spaces.replace("-dot-", ".");
        var commas = periods.replace("-comma-", ",");
        var paragraph = commas.replace("<p>", ". ");
        var tags = paragraph.replace("<*>", "");

        return tags;
    },

    getCJProduct: function (product) {
        var cjProduct = {
            itemId: product.MANUFACTURERID? product.MANUFACTURERID: product._id.valueOf(),
            viewItemURL: product.BUYURL,
            galleryURL: (product.IMAGEURL=="" || product.IMAGEURL == undefined)? "/images/nopicture.png": product.IMAGEURL,
            title: product.NAME,
            subtitle: product.MANUFACTURER,
            seoURL: getSEOUrl(product.NAME),
            vendor: getVendorKey(product.PROGRAMNAME)
        };

        cjProduct.price = product.PRICE;
        cjProduct.priceFormatted = '$' + product.PRICE;

        return cjProduct;
    },

    getPJProduct: function (product) {
        var pjProduct = {
            itemId: product.mpn? product.mpn: product._id.valueOf(),
            viewItemURL: product.buy_url,
            galleryURL: (product.image_url=="" || product.image_url == undefined)? "/images/nopicture.png": product.image_url,
            title: product.name,
            subtitle: this.formatPJData(product.description_short),
            seoURL: getSEOUrl(product.name),
            vendor: getVendorKey(product.program_name)
        };

        pjProduct.price = product.price;

        return pjProduct;
    },

    getCJProductDetail: function (product) {
        var cjProduct = {
            itemId: product.MANUFACTURERID? product.MANUFACTURERID: product._id.valueOf(),
            viewItemURL: product.BUYURL,
            galleryURL: (product.IMAGEURL=="" || product.IMAGEURL==undefined)? "/images/nopicture.png": product.IMAGEURL,
            categoryName: product.ADVERTISERCATEGORY,
            title: product.NAME,
            subtitle: product.MANUFACTURER,
            seoURL: getSEOUrl(product.NAME),
            description: product.DESCRIPTION,
            quantity: "1+",
            UPC: product.UPC,
            EAN: "N/A",
            SKU: product.SKU,
            ISBN : product.ISBN,
            attributes: {
                Brand: product.MANUFACTURER
            },
            vendor: getVendorKey(product.PROGRAMNAME)
        };

        cjProduct.price = product.PRICE;
        cjProduct.priceFormatted = '$' + product.PRICE;

        return cjProduct;
    },

    getPJProductDetail: function (product) {
        var pjProduct = {
            itemId: product.mpn? product.mpn: product._id.valueOf(),
            viewItemURL: product.buy_url,
            galleryURL: (product.image_url=="" || product.image_url == undefined)? "/images/nopicture.png": product.image_url,
            categoryName: product.category_program,
            title: product.name,
            subtitle: this.formatPJData(product.description_short),
            seoURL: getSEOUrl(product.name),
            description: this.formatPJData(product.description_long),
            quantity: "1+",
            UPC: product.upc,
            EAN: "N/A",
            SKU: product.sku,
            ISBN : product.isbn,
            attributes: {
                Brand: product.manufacturer
            },
            vendor: getVendorKey(product.program_name)
        };

        pjProduct.price = product.price;

        return pjProduct;

    },

    searchCJItems: function  (keywords, options, callback) {
        var keyword = keywords.join(" ").trim();
        if(keyword == "") {
            keyword = "Auto Parts";
        }

        var filters = {};
        if(options.vendorFilter != "") {
            filters.PROGRAMNAME = getVendorName(options.vendorFilter);
        }

        const total = CJFeeds.find(filters).count();

        filters["$text"] = { $search : keyword };

        const items = CJFeeds.find( filters, {
            fields: {score : { $meta: "textScore" }},
            sort: {score: {$meta: "textScore" }},
            limit: Meteor.settings.public.apiPerPage,
            skip: (options.page - 1) * Meteor.settings.public.apiPerPage
        }).fetch();

        if (!items || !items.length) {
            callback(new Error("cj feed items not found"));
        } else {
            var result = {
                products: items,
                total: {
                    totalEntries: total,
                    totalPages: Math.ceil(total/Meteor.settings.public.apiPerPage),
                    pageNumber: options.page,
                }
            };
            callback(null, result);
        }
    },

    searchPJItems: function  (keywords, options, callback) {
        var keyword = keywords.join(" ").trim();
        if(keyword == "") {
            keyword = "Auto Parts";
        }

        var filters = {};
        if(options.vendorFilter != "") {
            filters.program_name = getVendorName(options.vendorFilter);
        }

        const total = PJFeeds.find(filters).count();

        filters["$text"] = { $search : keyword };

        const items = PJFeeds.find( filters, {
            fields: {score : { $meta: "textScore" }},
            sort: {score: {$meta: "textScore" }},
            limit: Meteor.settings.public.apiPerPage,
            skip: (options.page - 1) * Meteor.settings.public.apiPerPage
        }).fetch();

        if (!items || !items.length) {
            callback(new Error("pj feed items not found"));
        } else {
            var result = {
                products: items,
                total: {
                    totalEntries: total,
                    totalPages: Math.ceil(total/Meteor.settings.public.apiPerPage),
                    pageNumber: options.page,
                }
            };
            callback(null, result);
        }
    },

    getCJItem: function (itemId, callback) {
        const productId = (itemId/1 == parseInt(itemId))? parseInt(itemId): itemId;
        var or = [{MANUFACTURERID: productId}];
        try {
            var id = new Meteor.Collection.ObjectID(itemId);
            or.push({_id: id});
        }
        catch(e) {
            console.log(e);
        }
        const product = CJFeeds.findOne({"$or": or});

        if(!product) {
            callback(new Error("No CJ item found"));
        } else {
            callback(null, product);
        }
    },

    getPJItem: function (itemId, callback) {
        const productId = (itemId/1 == parseInt(itemId))? parseInt(itemId): itemId;
        var or = [{mpn: productId}];
        try {
            var id = new Meteor.Collection.ObjectID(itemId);
            or.push({_id: id});
        }
        catch(e) {
            console.log(e);
        }
        const product = PJFeeds.findOne({"$or": or});

        if(!product) {
            callback(new Error("No PJ item found"));
        } else {
            callback(null, product);
        }
    }
};

export default LocalFeedApi;