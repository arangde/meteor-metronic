/**
 * Created by jaran on 7/6/2016.
 */
import { Meteor } from 'meteor/meteor';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';

import template from './contactForm.html';

class ContactForm {
    constructor($scope, $reactive) {
        'ngInject';

        document.title = "Contact || BitKar Parts";

        $reactive(this).attach($scope);

        this.contactName = '';
        this.companyName = '';
        this.contactEmail = '';
        this.contactPhone = '';
        this.message = '';

        this.helpers({
            mailTo() {
                return Meteor.settings.public.contactEmail;
            }
        });
    }

    submit($event) {
        $event.preventDefault();
        angular.element('.error').hide();
        angular.element('.success').hide();

        var name = this.getReactively('contactName');
        var company = this.getReactively('companyName');
        var email = this.getReactively('contactEmail');
        var phone = this.getReactively('contactPhone');
        var subject = "Contact from BitKar";
        var message = 'Name: ' + name + '<br/>';
        if(company && company != undefined)
            message += 'Company: ' + company + '<br/>';
        if(phone && phone != undefined)
            message += 'Phone: ' + phone + '<br/>';
        message += '<br/>' + this.getReactively('message').replace(/(?:\r\n|\r|\n)/g, '<br />');

        if (isValidEmail(email) && (message.length > 20) && (name.length > 1)) {
            Meteor.call("contact", {
                subject: subject,
                from:    email,
                body:    message
            }, function(err, result) {
                if(err) {
                    console.error(err);
                    // var errText = "";
                    // angular.element('.error').text(errText);
                    // angular.element('.error').fadeIn(1000);
                } else {
                    angular.element('.success').fadeIn(1000);
                    this.contactName = '';
                    this.companyName = '';
                    this.contactEmail = '';
                    this.contactPhone = '';
                    this.message = '';
                }
            });
        } else {
            angular.element('.error').text("E-mail must be valid or message must be longer than 20 characters.");
            angular.element('.error').fadeIn(1000);
        }    
        
        return false;
    }
}

const name = 'contactForm';

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    uiBootstrap
]).component(name, {
    template,
    controllerAs: name,
    controller: ContactForm
}).config(config);

function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('contact', {
            url: '/contact',
            template: '<contact-form></contact-form>'
        })
}