/**
 * Created by jaran on 7/6/2016.
 */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './home.html';

class Home {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';

        $reactive(this).attach($scope);

        const now = new Date();

        jQuery(document).ready(function() {
            if (jQuery().datepicker) {
                $('.date-picker').datepicker({
                    onSelect: function(dateText) {
                        var dateAsObject = $(this).datepicker( 'getDate' );

                        $("#form_workdate_day").val(dateAsObject.getDate());
                        $("#form_workdate_month").val(dateAsObject.getMonth()+1);
                        $("#form_workdate_year").val(dateAsObject.getFullYear());

                        $("#form_date_day").val(dateAsObject.getDate());
                        $("#form_date_month").val(dateAsObject.getMonth()+1);
                        $("#form_date_year").val(dateAsObject.getFullYear());
                    }
                });
            }
        });

    }

}

const name = 'home';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: Home
}).config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('home', {
        url: '/',
        template: '<home></home>'
    });
}