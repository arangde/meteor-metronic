/**
 * Created by jaran on 7/22/2016.
 */
import angular from 'angular';

const name = 'directives.image-resize';

export default name;

angular.module(name, [])
    .directive('imageResize', function () {
        return function (scope, element, attrs) {
            var wrapperWidth = 300; //$(this).width();
            var wrapperHeight = 250; //$(this).height();
            element.one('load', function() {
                var imageWidth = this.width;
                var imageHeight = this.height;
                var canvas = document.createElement('canvas');
                
                var ratio = (imageHeight + 1) / imageWidth;
                if(wrapperHeight > wrapperWidth * ratio) {
                    imageHeight = wrapperHeight;
                    imageWidth = imageHeight / ratio;
                }
                else {
                    imageWidth = wrapperWidth;
                    imageHeight = imageWidth * ratio;
                }

                this.width = imageWidth;
                this.height = imageHeight;

                // canvas.width = imageWidth;
                // canvas.height = imageHeight;
                // canvas.getContext('2d').drawImage(element[0], 0, 0, imageWidth, imageHeight);
                // element.attr('src', canvas.toDataURL("image/jpeg"));

            });
        };
    });
