/**
 * Created by jaran on 8/28/2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Match } from 'meteor/check';
import async from 'async';
import logger from 'winston';
import { EJSON } from 'meteor/ejson';
import { getVendorKey } from '../vendors';
import { getSEOUrl, replacePropertyKey, removeHeadTags, getValueOfKey } from '../include';

const ebayKeys = Meteor.settings.ebay;

var EbayApi = {
    cachedCategories: [],

    isCachedCategory: function (category) {
        var cached = false;
        _.each(this.cachedCategories, function (cachedCategory) {
            if (cachedCategory.CategoryID == category.CategoryID) {
                cached = true;
            }
        });

        return cached;
    },

    getPrice: function (json) {
        var priceStatus = getValueOfKey(json, ["sellingStatus", "convertedCurrentPrice"]) || getValueOfKey(json, ["sellingStatus", "currentPrice"]);

        if (priceStatus != undefined) {
            if(priceStatus.currencyId == "USD")
                return [priceStatus.amount, '$' + priceStatus.amount];
            else
                return [priceStatus.amount, priceStatus.amount + priceStatus.currencyId];
        }
        else {
            return [0, ""];;
        }
    },

    getProduct: function (json) {
        var json = replacePropertyKey(json);
        var product = {};
        var params = ["itemId", "title", "subtitle", "globalId", "primaryCategory", "galleryURL", "viewItemURL", "distance",
            "paymentMethod", "autoPay", "postalCode", "location", "country", "shippingInfo", "sellingStatus"];
        for (var i = 0; i < params.length; i++) {
            if (Match.test(json[params[i]], Match.Any) && json[params[i]] != undefined) {
                product[params[i]] = json[params[i]];
            }
        }

        var price = this.getPrice(json);
        product.price = price[0];
        product.priceFormatted = price[1];

        if (product.distance) {
            var distance = {
                "_": getValueOfKey(product.distance, ['_']),
                "unit": getValueOfKey(product.distance, ['_prop', 'unit'])
            };
            product.distance = distance;
        }

        product.seoURL = getSEOUrl(json.title);
        product.vendor = getVendorKey("Ebay");

        return product;
    },

    getPriceDetail: function (json) {
        var priceStatus = getValueOfKey(json, ["SellingStatus", "ConvertedCurrentPrice"]) || getValueOfKey(json, ["SellingStatus", "CurrentPrice"]);

        if (priceStatus != undefined) {
            if(priceStatus.currencyID == "USD")
                return [priceStatus.amount, '$' + priceStatus.amount];
            else
                return [priceStatus.amount, priceStatus.amount + priceStatus.currencyID];
        }
        else {
            return [0, ""];
        }
    },

    getProductDetail: function (json) {
        var json = replacePropertyKey(json);
        var product = {};
        var params = ["ItemID", "Title", "SubTitle", "PrimaryCategory", "Description", "Quantity", "PaymentMethods",
            "PictureDetails", "ListingDetails", "PostalCode", "Location", "Country", "Seller", "ShippingDetails", "ShipToLocations"];
        for (var i = 0; i < params.length; i++) {
            if (Match.test(json[params[i]], Match.Any) && json[params[i]] != undefined) {
                product[params[i]] = json[params[i]];
            }
        }

        var productDetail = {
            itemId: product.ItemID,
            viewItemURL: product.ListingDetails.ViewItemURL,
            galleryURL: product.PictureDetails.GalleryURL,
            categoryName: product.PrimaryCategory.CategoryName,
            title: product.Title,
            subtitle: product.SubTitle,
            seoURL: getSEOUrl(product.Title),
            description: product.Description,
            quantity: product.Quantity,
            attributes: {
                PaymentMethods: product.PaymentMethods,
                Location: product.PostalCode + ' ' + product.Location + ' ' + product.Country,
                Shipping: product.ShippingDetails.ShippingType
            },
            vendor: getVendorKey("Ebay")
        };

        var price = this.getPriceDetail(json);
        productDetail.price = price[0];
        productDetail.priceFormatted = price[1];
        productDetail.description = removeHeadTags(productDetail.description, "<head", "<\/head>");
        productDetail.description = removeHeadTags(productDetail.description, "<style", "<\/style>");
        productDetail.description = removeHeadTags(productDetail.description, "<script", "<\/script>");

        return productDetail;
    },

    getTopProduct: function (json) {
        var product = replacePropertyKey(json);
        product.seoURL = getSEOUrl(product.title);
        product.vendor = getVendorKey("Ebay");

        if(product.buyItNowPrice != undefined) {
            if(product.buyItNowPrice.currencyId == 'USD') {
                product.price = '$' + product.buyItNowPrice.amount;
            }
            else {
                product.price = product.buyItNowPrice.amount + product.buyItNowPrice.currencyId;
            }
        }
        else {
            product.price = "";
        }

        return product;
    },

    getCategoryItems: function (categoryId, callback) {
        var params = {
            categoryId: categoryId,
            'SERVICE-VERSION': ebayKeys.findingVer
        };
        ebay.xmlRequest({
                serviceName: 'Finding',
                opType: 'findItemsByCategory',
                appId: ebayKeys.appID,
                params: params,
                parser: ebay.parseResponseJson    // (default)
            },
            function (error, itemsResponse) {
                if (error) {
                    callback(error);
                }
                else {
                    if (Match.test(itemsResponse.searchResult.item, Match.Any) && itemsResponse.searchResult != "undefined") {
                        callback(null, itemsResponse.searchResult.item);
                    }
                    else {
                        var requestError = new Error("Server not respond!");
                        callback(requestError);
                    }
                }
            }
        );
    },

    getItemsByKeywords: function (keywords, callback) {
        var params = {
            keywords: keywords,
            paginationInput: {
                entriesPerPage: 5 //Meteor.settings.public.apiPerPage,
            },
            itemFilter: [],
            categoryId: ebayKeys.baseCategoryId
        };

        ebay.xmlRequest({
                serviceName: 'Finding',
                opType: 'findItemsByKeywords',
                appId: ebayKeys.appID,
                params: params,
                parser: ebay.parseResponseJson    // (default)
            },
            function (error, itemsResponse) {
                if (error) {
                    callback(error);
                }
                else {
                    if (Match.test(itemsResponse.searchResult, Match.Any) && itemsResponse.searchResult != undefined) {
                        if (Array.isArray(itemsResponse.searchResult.item)) {
                            callback(null, itemsResponse.searchResult.item);
                        }
                        else {
                            if (Match.test(itemsResponse.searchResult.item, Match.Any) && itemsResponse.searchResult.item != undefined) {
                                callback(null, [itemsResponse.searchResult.item]);
                            }
                            else {
                                var requestError = new Error("Items not found!");
                                callback(requestError);
                            }
                        }
                    }
                    else {
                        var requestError = new Error("Server not respond!");
                        callback(requestError);
                    }
                }
            }
        );
    },

    getItemsAdvanced: function (keywords, options, callback) {
        var params = {
            keywords: keywords,
            paginationInput: {
                entriesPerPage: Meteor.settings.public.apiPerPage,
                pageNumber: options.ebayPage
            },
            // 'REST-PAYLOAD': true,
            affiliate: ebayKeys.affiliate
        };

        if (options['categoryId']) {
            params['categoryId'] = options['categoryId'];
        }
        else {
            params['categoryId'] = ebayKeys.baseCategoryId; // auto parts base category
        }

        if (options['priceSort'] && options['priceSort'] == 1) {
            params['sortOrder'] = "PricePlusShippingLowest";
        }
        else if (options['priceSort'] && options['priceSort'] == 2) {
            params['sortOrder'] = "PricePlusShippingHighest";
        }

        if (options['postalCode']) {
            params['buyerPostalCode'] = options['postalCode'];
        }

        console.log('ebay params', params);

        ebay.xmlRequest({
                serviceName: 'Finding',
                opType: 'findItemsAdvanced',
                appId: ebayKeys.appID,
                params: params,
                parser: ebay.parseResponseJson
            },
            function (error, itemsResponse) {
                if (error) {
                    callback(error);
                }
                else {
                    var result = {};
                    if (Match.test(itemsResponse.searchResult, Match.Any) && itemsResponse.searchResult != undefined) {
                        if (Array.isArray(itemsResponse.searchResult.item)) {
                            result.products = itemsResponse.searchResult.item;
                        }
                        else {
                            if (Match.test(itemsResponse.searchResult.item, Match.Any) && itemsResponse.searchResult.item != undefined) {
                                result.products = [itemsResponse.searchResult.item];
                            }
                            else {
                                var requestError = new Error("ebay items not found!");
                                callback(requestError);
                            }
                        }
                        if (Match.test(itemsResponse.paginationOutput, Match.Any) && itemsResponse.paginationOutput != undefined) {
                            result.total = itemsResponse.paginationOutput;
                        }
                        callback(null, result);
                    }
                    else {
                        var requestError = new Error("ebay server not respond!");
                        callback(requestError);
                    }
                }
            }
        );
    },

    getCategories: function (categoryId, callback) {
        var params = {
            CategoryID: categoryId,
            IncludeSelector: 'ChildCategories'
        };
        ebay.xmlRequest({
                serviceName: 'Shopping',
                opType: 'GetCategoryInfo',
                appId: ebayKeys.appID,
                params: params,
                parser: ebay.parseResponseJson    // (default)
            },
            function (error, categoriesResponse) {
                if (error) {
                    logger.error(error);
                }
                else {
                    if (Match.test(categoriesResponse.Categorys, Match.Any) && categoriesResponse.Categorys != undefined) {
                        if (Array.isArray(categoriesResponse.Categorys)) {
                            callback(null, categoriesResponse.Categorys);
                        }
                        else {
                            callback(null, [categoriesResponse.Categorys]);
                        }
                    }
                    else {
                        var requestError = new Error("ebay server not respond!");
                        logger.error(requestError);
                    }
                }
            }
        );
    },

    getItem: function (itemId, callback) {
        var params = {
            ItemID: itemId,
            DetailLevel: "ItemReturnDescription"
        };
        ebay.xmlRequest({
                serviceName: 'Trading',
                opType: 'GetItem',
                appId: ebayKeys.appID,
                devId: ebayKeys.devID,
                certId: ebayKeys.certID,
                authToken: ebayKeys.token,
                params: params,
                parser: ebay.parseResponseJson    // (default)
            },
            function (error, itemResponse) {
                if (error) {
                    callback(error);
                }
                else {
                    if (Match.test(itemResponse.Item, Match.Any) && itemResponse.Item != undefined) {
                        callback(null, itemResponse.Item);
                    }
                    else {
                        var requestError = new Error("Server not respond!");
                        callback(requestError);
                    }
                }
            }
        );
    },

    getTopProducts: function (callback) {
        var params = {
            affiliate: ebayKeys.affiliate,
            categoryId: ebayKeys.baseCategoryId
        };
        ebay.xmlRequest({
                serviceName: 'Merchandising',
                opType: 'getMostWatchedItems',
                appId: ebayKeys.appID,
                devId: ebayKeys.devID,
                certId: ebayKeys.certID,
                params: params,
                parser: ebay.parseResponseJson    // (default)
            },
            function (error, response) {
                if (error) {
                    callback(error);
                }
                else {
                    if (Match.test(response.itemRecommendations, Match.Any) && response.itemRecommendations != undefined) {
                        if (Array.isArray(response.itemRecommendations.item)) {
                            callback(null, response.itemRecommendations.item);
                        }
                        else {
                            if (Match.test(response.itemRecommendations.item, Match.Any) && response.itemRecommendations.item != undefined) {
                                callback(null, [response.itemRecommendations.item]);
                            }
                            else {
                                var requestError = new Error("Items not found!");
                                callback(requestError);
                            }
                        }
                    }
                    else {
                        var requestError = new Error("Server not respond!");
                        callback(requestError);
                    }
                }
            }
        );
    },

    getCategoriesHierarchy: function (categoryId, finalCallback) {
        this.getCategories(categoryId, function (callErr, categories) {
            if (callErr) {
                finalCallback(callErr);
            }
            else {
                async.eachSeries(categories, function (category, itemCallback) {
                    if (this.isCachedCategory(category)) {
                        async.setImmediate(function () {
                            itemCallback(null, category);
                        });
                    } else {
                        this.cachedCategories.push(category);
                        if (category.LeafCategory === 'false') {
                            this.getCategoriesHierarchy(category.CategoryID, itemCallback);
                        } else {
                            itemCallback(null, category);
                        }
                    }
                }, function (resultErr, result) {
                    if (resultErr) {
                        finalCallback(resultErr);
                    }
                    else {
                        finalCallback(null, result);
                    }
                });
            }
        });
    }
};

export default EbayApi;