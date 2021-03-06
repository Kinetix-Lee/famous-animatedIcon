/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*jslint browser:true, nomen:true, vars:true, plusplus:true*/
/*global define*/

define(function(require, exports, module) {

    // import dependencies
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var View = require('famous/core/View');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');

    /**
     * @enum
     */
    var Shape = {
        HAMBURGER: 0,
        LEFT_ARROW: 1
    };

    /**
     * @class
     * @extends View
     * @param {Object} [options] Configuration options
     */
    function AnimatedIcon(options) {
        View.apply(this, arguments);

        this._createLines();
        this._createShapes();

        this.setShape(Shape.HAMBURGER, {duration: 0});
    }
    AnimatedIcon.prototype = Object.create(View.prototype);
    AnimatedIcon.prototype.constructor = AnimatedIcon;
    AnimatedIcon.Shape = Shape;

    AnimatedIcon.DEFAULT_OPTIONS = {
        defaultTransition: {duration: 300, curve: Easing.inOutQuart}
    };

    /**
     * Create line modifiers & surfaces
     */
    AnimatedIcon.prototype._createLines = function() {
        var i;
        this.lines = [];
        for (i = 0; i < 3; i++) {
            var modifier = new StateModifier({
                align: [0.5, 0.0],
                origin: [0.0, 0.5]
            });
            var surface = new Surface({
                classes: ['line']
            });
            this.add(modifier).add(surface);
            this.lines.push(modifier);
        }
    };

    /**
     * Create shapes
     */
    AnimatedIcon.prototype._createShapes = function() {
        this.shapes = [];

        // Hamburger
        this.shapes.push({
            name: 'hamburger',
            lines: [
                { size: [24, 2], transform: Transform.translate(0, 8, 0) },
                { size: [24, 2], transform: Transform.translate(0, 15, 0) },
                { size: [24, 2], transform: Transform.translate(0, 22, 0) }
            ]
        });

        // Left-arrow
        this.shapes.push({
            name: 'left-arrow',
            lines: [
                { size: [10, 2], transform: Transform.multiply(Transform.translate(10, 21.5, 0), Transform.rotateZ((Math.PI / 180) * 225)) },
                { size: [16, 2], transform: Transform.multiply(Transform.translate(20, 15, 0), Transform.rotateZ((Math.PI / 180) * 180)) },
                { size: [10, 2], transform: Transform.multiply(Transform.translate(3, 15.5, 0), Transform.rotateZ((Math.PI / 180) * 315)) }
            ]
        });
    };

    /**
     * Sets the shape
     */
    AnimatedIcon.prototype.setShape = function(shapeIndex, transition, callback) {
        if (this._shapeIndex === shapeIndex) {
            if (callback) {
                callback();
            }
            return;
        }
        this._shapeIndex = shapeIndex;
        transition = transition || this.options.defaultTransition;
        var i;
        var shape = this.shapes[shapeIndex];
        for (i = 0; i < shape.lines.length; i++) {
            this.lines[i].halt();
            this.lines[i].setSize(shape.lines[i].size, transition);
            if (i === 0) {
                this.lines[i].setTransform(shape.lines[i].transform, transition, callback);
            }
            else {
                this.lines[i].setTransform(shape.lines[i].transform, transition);
            }
        }
    };

    /**
     * Get the shape
     */
    AnimatedIcon.prototype.getShape = function(shapeIndex, transition) {
        return this._shapeIndex;
    };

    module.exports = AnimatedIcon;
});
