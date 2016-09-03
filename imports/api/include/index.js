/**
 * Created by jaran on 8/28/2016.
 */
import { Match } from 'meteor/check';
import { EJSON } from 'meteor/ejson';

exports.getSEOUrl = function (url) {
    return url.trim().replace(/[^a-zA-Z0-9-.]/g, "-").replace(/---/g, "-").replace(/--/g, "-").toLowerCase();
};

exports.replacePropertyKey = function (json) {
    var str = EJSON.stringify(json);
    json = JSON.parse(str, function(key, value) {
        if(key == '$') {
            this._prop = value;
            delete this[key];
            return;
        }
        else {
            return value;
        }
    });

    return json;
};

exports.getValueOfKey = function (params, keys) {
    var childParams = params;
    for (var i = 0; i < keys.length; i++) {
        if (Match.test(childParams[keys[i]], Match.Any) && childParams[keys[i]] != undefined) {
            childParams = childParams[keys[i]];
        }
        else {
            return null;
        }
    }
    return childParams;
};

function removeHeadTags (html, stag, etag) {
    var pos = html.indexOf(stag);
    if(pos !== -1) {
        var pos2 = html.indexOf(etag);
        if(pos2 !== -1) {
            var subhtml = html.replace(html.substr(pos, pos2 + etag.length - pos), '');
            return removeHeadTags(subhtml, stag, etag);
        }
    }
    return html;
};
exports.removeHeadTags = removeHeadTags;