/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import ngAnimate from 'angular-animate';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import template from './productsList.html';
import { name as FeaturedList } from '../featuredList/featuredList';
import { Products } from '../../../api/products';
import { Categories } from '../../../api/categories';
import { LegacyVehicles } from '../../../api/legacyvehicles';
import { EngineLegacies } from '../../../api/enginelegacies';
import { Parts } from '../../../api/parts';
import { ProductCount } from '../../../api/productCount';
import { Vendors } from '../../../api/vendors';

class ProductsList {
    constructor($stateParams, $scope, $reactive, $http) {
        'ngInject';

        $reactive(this).attach($scope);

        document.title = "Find Products || BitKar Parts";

        this.maxYear = (new Date()).getFullYear() + 1;
        this.minYear = 1980;
        this.years = [];

        this.perPage = Meteor.settings.public.perPage;
        this.page = 1;
        this.viewMode = 'box';

        this.searchText = '';
        this.model = '';
        this.year = '';
        this.make = '';
        this.engine = '';
        this.searching = false;
        this.searchFailed = false;

        this.priceSort = '';
        this.vendorFilter = '';
        this.shippingFilter = '';

        this.postalCode = '';

        console.log("sessionId", BitKarSession.sessionId);

        //this.getPostalCode(this, $http);

        this.productsHandler = this.subscribe('products', () => [{
                limit: parseInt(this.perPage),
                skip: parseInt((this.getReactively('page') - 1) * this.perPage)
            },
            {
                // searchText: this.searchText,
                priceSort: this.getReactively('priceSort'),
                // shippingFilter: this.getReactively('shippingFilter'),
                vendorFilter: this.getReactively('vendorFilter')? this.getReactively('vendorFilter'): "",
                page: parseInt(this.getReactively('page')),
                sessionId: BitKarSession.sessionId
            }
        ]);

        this.categoriesHandler = this.subscribe('categories', () => [
            { }, { }
        ]);

        this.subscribe('productcount', () => [
            {sessionId: BitKarSession.sessionId},
            {vendor: this.getReactively('vendorFilter')}
        ]);

        this.subscribe('vendors');

        this.makesHandler = null;
        this.modelsHandler = null;
        this.enginesHandler = null;

        this.categoryId = '';
        this.partId = '';
        if($stateParams.categoryId != undefined) {
            console.log("categoryId: ", $stateParams.categoryId);
            this.categoryId = $stateParams.categoryId;
            this.findProducts();
        }
        else if($stateParams.partId != undefined) {
            console.log("partId: ", $stateParams.partId);
            this.partId = $stateParams.partId;

            var subscriptionHandle = this.subscribe('parts', () => [{partId: parseInt(this.partId)}], {
                onReady: function () {
                    var part = Parts.findOne({"PartID": parseInt(this.partId)});
                    if(part) {
                        this.searchText = part.PartName;
                        this.findProducts();
                    }
                }
            });
        }
        else if(!this.searching) {
            var that = this;
            that.findLocal();
        }

        this.helpers({
            categories() {
                const options = {};

                return Categories.find(options);
            },
            products() {
                const options = {};

                return Products.find(options);
            },
            years() {
                for(var i=this.minYear; i<=this.maxYear; i++) {
                    this.years.push(i);
                }
                return this.years;
            },
            makes() {
                const makes = []
                LegacyVehicles.find({}).forEach(function(legacyVehicle) {
                    if(makes.indexOf(legacyVehicle.Make) === -1) {
                        makes.push(legacyVehicle.Make);
                    }
                });
                makes.sort();
                return makes;
            },
            models() {
                // const options = {"Year": this.year, "Make": this.make};
                // return LegacyVehicles.find(options);
                var models = []
                LegacyVehicles.find({}).forEach(function(legacyVehicle) {
                    if(models.indexOf(legacyVehicle.Model) === -1) {
                        models.push(legacyVehicle.Model);
                    }
                });
                models.sort();
                return models;
            },
            engines() {
                var engines = [];
                EngineLegacies.find({}).forEach(function(engineLegacy) {
                    engineLegacy.EngineName = "";
                    engineLegacy.EngineName += engineLegacy.EngType? engineLegacy.EngType + " " : "";
                    engineLegacy.EngineName += engineLegacy.Liter? engineLegacy.Liter + " " : "";
                    engineLegacy.EngineName += engineLegacy.CC? engineLegacy.CC + " " : "";
                    engineLegacy.EngineName += engineLegacy.CID? engineLegacy.CID + " " : "";
                    engineLegacy.EngineName += engineLegacy.Fuel? engineLegacy.Fuel + " " : "";
                    engineLegacy.EngineName += engineLegacy.FuelDel? engineLegacy.FuelDel + " " : "";
                    engineLegacy.EngineName += engineLegacy.Asp? engineLegacy.Asp + " " : "";
                    engineLegacy.EngineName += engineLegacy.EngVIN? engineLegacy.EngVIN + " " : "";
                    engineLegacy.EngineName += engineLegacy.EngDesg? engineLegacy.EngDesg + " " : "";
                    engines.push(engineLegacy);
                });
                return engines;
            },
            numberOfPages() {
                var productCount = 0;
                ProductCount.find({}).forEach(function(product) {
                    productCount += parseInt(product.total.totalEntries);
                });
                return Math.ceil(productCount / this.perPage);
            },
            productsCount() {
                var productCount = 0;

                var cursor = ProductCount.find({});

                if(cursor.count()) {
                    cursor.forEach(function (product) {
                        productCount += parseInt(product.total.totalEntries);
                    });
                    this.searching = false;
                }
                if(!this.searching) {
                    if(productCount>0) {
                        this.searchFailed = false;
                    }
                    else {
                        this.searchFailed = true;
                    }
                }

                return productCount;
            },
            vendors() {
                return Vendors.find();
            }
        });
    }

    pageChanged(newPage) {
        this.page = newPage;

        var numberOfProducts = Counts.get('numberOfProducts');
        if(numberOfProducts <= parseInt(newPage * this.perPage)) {
            this.findProducts(false);
        }
    }

    allCategories($event) {
        this.categoryId = "";
        this.searchText = "";

        angular.element("ul.filter>li.active").removeClass("active");
        angular.element($event.target).addClass("active");

        this.search();
    }

    categoryChanged(category, $event) {
        this.categoryId = category.CategoryID;
        this.searchText = category.CategoryName;

        angular.element("ul.filter>li.active").removeClass("active");
        angular.element($event.target).addClass("active");

        this.search();
    }

    viewChanged(viewMode, $event) {
        this.viewMode = viewMode;
        angular.element(".view-mode>a").removeClass("active");
        angular.element(".view-mode>a.mod-" + viewMode).addClass("active");

        var $elHide = (viewMode == "box")? $(".product-list.list-view"): $(".product-list.box-view");
        var $elShow = (viewMode == "box")? $(".product-list.box-view"): $(".product-list.list-view");

        if(!$elHide.hasClass("hide")) {
            $elHide.fadeIn(600, function() { $elHide.addClass("hide") });
        }
        if($elShow.hasClass("hide")) {
            $elShow.fadeOut(600, function() { $elShow.removeClass("hide") });
        }

        var $featuredHide = (viewMode == "box")? $(".featured-products-list"): $(".featured-products");
        var $featuredShow = (viewMode == "box")? $(".featured-products"): $(".featured-products-list");

        if(!$featuredHide.hasClass("hide")) {
            $featuredHide.fadeIn(600, function() { $featuredHide.addClass("hide") });
        }
        if($featuredShow.hasClass("hide")) {
            $featuredShow.fadeOut(600, function() { $featuredShow.removeClass("hide") });
        }
    }

    yearChanged() {
        if(this.makesHandler) {
            this.makesHandler.stop();
        }
        this.makesHandler = this.subscribe('legacyvehicles', () => [{
            }, {
                year: this.year
            }
        ]);
    }

    makeChanged() {
        const models = []
        LegacyVehicles.find({"Make": this.make}).forEach(function(legacyVehicle) {
            if(models.indexOf(legacyVehicle.Model) === -1) {
                models.push(legacyVehicle.Model);
            }
        });
        models.sort();
        this.models = models;
    }

    modelChanged() {
        if(this.enginesHandler) {
            this.enginesHandler.stop();
        }
        this.enginesHandler = this.subscribe('enginelegacies', () => [{
            }, {
                year: this.year,
                make: this.make,
                model: this.model
            }
        ]);
    }

    engineChanged() {
        this.searchable = true;
    }

    vendorChanged() {
        this.page = 1;
        this.findProducts();
    }

    filter() {
        this.page = 1;
        this.findProducts();
    }

    search() {
        // this.priceSort = '';
        // this.vendorFilter = '';
        // this.shippingFilter = '';
        this.page = 1;

        this.findProducts();
    }

    findProducts(reload = true) {
        this.searching = true;
        this.searchFailed = false;

        var options = {
            categoryId: this.getReactively('categoryId'),
            priceSort: this.getReactively('priceSort'),
            vendorFilter: this.getReactively('vendorFilter')? this.getReactively('vendorFilter'): "",
            shippingFilter: this.getReactively('shippingFilter'),
            // postalCode: this.getReactively('postalCode')? this.getReactively('postalCode'): "",
            reload: reload,
            sessionId: BitKarSession.sessionId
        }

        var filters = {
            searchText: this.getReactively('searchText'),
            year: this.getReactively('year'),
            make: this.getReactively('make')? this.getReactively('make'): "",
            model: this.getReactively('model')? this.getReactively('model'): ""
        };

        if(this.engine) {
            filters.EngType = this.engine.EngType;
            filters.Liter = this.engine.Liter;
            // filter.CC = this.engine.CC;
            // filter.CID = this.engine.CID;
            // filter.Fuel = this.engine.Fuel;
            // filter.FuelDel = this.engine.FuelDel;
            // filter.Asp = this.engine.Asp;
            // filter.EngVIN = this.engine.EngVIN;
            // filter.EngDesg = this.engine.EngDesg;
        }

        Meteor.call('findItemsAdvanced', filters, options, (error, result) => {
            if (error) {
                console.error('Error detected on find items', error);
            } else {

            }
        });
    }

    findLocal() {
        this.page = 1;
        this.searching = true;
        this.searchFailed = false;

        var options = {
            sessionId: BitKarSession.sessionId
        }

        Meteor.call('findLocal', options, (error, result) => {
            if (error) {
                console.error('Error detected on find local', error);
            } else {

            }
        });
    }

    getPostalCode(returnObject, $http) {
        window.navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true').then(function(res) {
                if (res.status == 200) {
                    var results = res.data.results;
                    if (results[0]) {
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            if(results[0].address_components[i].types[0] == "postal_code") {
                                returnObject.postalCode = results[0].address_components[i].short_name;
                                console.log('postalCode', returnObject.postalCode);
                            }
                        }
                    }
                }
            });
        }, function(error) {
            console.log(error);
        });
    }

}


const name = 'productsList';

// create a module
export default angular.module(name, [
    ngAnimate,
    angularMeteor,
    uiRouter,
    utilsPagination,
    FeaturedList
]).component(name, {
    template,
    controllerAs: name,
    controller: ProductsList
}).config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('products', {
            url: '/shop',
            template: '<products-list></products-list><featured-list></featured-list>'
        })
        .state('category', {
            url: '/category/:title/:categoryId/',
            template: '<products-list></products-list><featured-list></featured-list>'
        })
        .state('part', {
            url: '/parts/:title/:partId/',
            template: '<products-list></products-list><featured-list></featured-list>'
        });
}