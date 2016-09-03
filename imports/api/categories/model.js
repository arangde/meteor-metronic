/**
 * Created by jaran on 7/15/2016.
 */
import { Categories } from './collection';

import async from 'async';

if(Meteor.isServer) {
    var cachedCategoryIds = [];

    function getChildCategories(categoryId) {
        return Categories.find({'CategoryParentID': categoryId}).fetch();
    };

    function loadCategory(categoryId) {
        categoryId = categoryId.toString();

        const category = Categories.findOne({'CategoryID': categoryId});

        if (!category) {
            var err = new Error(404, "Not found category");
            throw err;
        }
        else {
            cachedCategoryIds.push(categoryId);

            var children = getChildCategories(categoryId);
            async.each(children, function (child) {
                if(cachedCategoryIds.indexOf(child.CategoryID) === -1) {
                    if (child.LeafCategory) {
                        cachedCategoryIds.push(child.CategoryID);
                    }
                    else {
                        loadCategory(child.CategoryID);
                    }
                }
            });
        }
    };

    function getCategoryIds(categoryId) {
        cachedCategoryIds = [];
        loadCategory(categoryId);
        
        return cachedCategoryIds;
    };

    exports.getCategoryIds = getCategoryIds;
}
