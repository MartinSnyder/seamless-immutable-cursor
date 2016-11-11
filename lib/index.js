'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      MIT License
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Copyright (c) 2016 Martin Snyder
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Permission is hereby granted, free of charge, to any person obtaining a copy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      of this software and associated documentation files (the "Software"), to deal
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      in the Software without restriction, including without limitation the rights
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      copies of the Software, and to permit persons to whom the Software is
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      furnished to do so, subject to the following conditions:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      The above copyright notice and this permission notice shall be included in all
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      copies or substantial portions of the Software.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      SOFTWARE.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Cursor data that is private to the class/module.
 *
 * Instances of this class manage MUTABLE data associated with a cursor. This includes:
 * - The current generation of the immutable state object
 * - The current list of change listeners
 *
 * Because this class is private to the module and never returned to an outside caller,
 * its usage is known to us. It can ONLY be constructed by a root cursor and is shared
 * between the root cursor and any child cursors 'refined' from there.
 */
var PrivateData = function () {
    function PrivateData(initialData) {
        _classCallCheck(this, PrivateData);

        this.currentData = initialData;
        this.changeListeners = [];
    }

    /*
     * Updates the portion of this.currentData referenced by 'path' with the 'newValue'
     */


    _createClass(PrivateData, [{
        key: 'update',
        value: function update(path, newValue) {
            // this.currentData is about to become the "previous generation"
            var prevData = this.currentData;

            // Apply the update to produce the next generation. Because this.currentData has
            // been processed by seamless-immutable, nextData will automatically be immutable as well.
            this.currentData = this.currentData.setIn(path, newValue);

            // Notify all change listeners
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.changeListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var changeListener = _step.value;

                    // Pass nextData first because many listeners will ONLY care about that.
                    changeListener(this.currentData, prevData, path);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /*
         * Adds a new change listener to this managed data with the following signature:
         *      function changeListener(nextRoot, prevRoot, pathUpdated)
         *
         * Where the parameters pass to this function have the following data types
         *      nextRoot - Next generation of the JSON-style immutable data being managed by a cursor
         *      prevRoot - Previous generation of the JSON-style immutable data being managed by a cursor
         *      pathUpdated - Array of String indicating the keys used to navigate a nested/hierarchical
         *                    structure to the point where the update occurred.
         */

    }, {
        key: 'addListener',
        value: function addListener(changeListener) {
            this.changeListeners.push(changeListener);
        }
    }]);

    return PrivateData;
}();

/*
 * ES6 classes don't have a direct provision for private data, but we can associate data
 * with a class via a WeakMap and hide that WeakMap within the module.
 *
 * This WeakMap is of mapping of Cursor->PrivateData
 */


var privateDataMap = new WeakMap();

/*
 * Implementation of a cursor referencing an evolving immutable data structure.
 *
 * Note that callers of this module CAN receive instances of this class through
 * the normal usage pattern of constructing a 'RootCursor' object and then
 * calling 'refine', but they cannot construct them on their own.
 */

var Cursor = function () {
    /*
     * This class is private to the module, so its constructor is impossible to
     * invoke externally. This is good since the "privateData" parameter of the
     * constructor is not something we want external callers to attempt to provide.
     */
    function Cursor(privateData, path) {
        _classCallCheck(this, Cursor);

        // Keep our private data hidden. This data is 'owned' by a RootCursor and
        // shared with all cursors 'refined' from that root (or 'refined' from a
        // child cursor of that root)
        privateDataMap.set(this, privateData);

        // Path will have already been locked by seamless-immutable
        this.path = path;

        // Freeze ourselves so that callers cannot re-assign the path post-construction
        Object.freeze(this);
    }

    /*
     * Property getter for 'data' property of a cursor. This returns the section of the
     * current generation of immutable data referred to by the path of the cursor.
     *
     * Calling this getter over time may return different results, but the data returned
     * is an immutable object that can be safely referenced without copy.
     *
     * This getter returns undefined in the case where the path specified by the cursor
     * does not exist in the current generation of the managed data.
     */


    _createClass(Cursor, [{
        key: 'refine',


        /*
         * Create a new child cursor from this cursor with the subPath appended to our current path
         */
        value: function refine(subPath) {
            if (subPath.length === 0) {
                return this;
            } else {
                // Because this.path is already immutable, this.path.concat returns
                // a new immutable array.
                return new Cursor(privateDataMap.get(this), this.path.concat(subPath));
            }
        }
    }, {
        key: 'data',
        get: function get() {
            // I didn't see a 'getIn' method in seamless-immutable that was publicly accessible
            // So I rolled my own
            var pointer = privateDataMap.get(this).currentData;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.path[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var el = _step2.value;

                    pointer = pointer ? pointer[el] : undefined;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return pointer;
        }

        /*
         * Property setter for 'data' property of a cursor. This creates a new generation
         * of the managed data object with the provided 'newValue' replacing whatever
         * exists in the 'path' of the current generation
         *
         * No attempt is made to address issues such as stale writes. Concurrency issues
         * are the responsibility of caller.
         */
        ,
        set: function set(newValue) {
            privateDataMap.get(this).update(this.path, newValue);
        }
    }]);

    return Cursor;
}();

/*
 * Public entry into this module.
 *
 * RootCursor objects are the same as regular cursor objects except that:
 * 1. The 'root' cursor can be constructed by external callers
 * 2. The 'root' cursor can register changeListeners
 */


var RootCursor = function (_Cursor) {
    _inherits(RootCursor, _Cursor);

    function RootCursor() {
        var initialRoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, RootCursor);

        // Use seamless-immutable to constrain the initial data. This is the only
        // place where we invoke seamless-immutable because once we do this, our
        // interactions with these objects will only spawn other immutable objects
        return _possibleConstructorReturn(this, (RootCursor.__proto__ || Object.getPrototypeOf(RootCursor)).call(this, new PrivateData((0, _seamlessImmutable2.default)(initialRoot)), (0, _seamlessImmutable2.default)([])));
    }

    /*
     * Adds a new change listener to this cursor with the following signature:
     *      function changeListener(nextRoot, prevRoot, pathUpdated)
     *
     * Where the parameters pass to this function have the following data types
     *      nextRoot - Next generation of the JSON-style immutable data being managed by a cursor
     *      prevRoot - Previous generation of the JSON-style immutable data being managed by a cursor
     *      pathUpdated - Array of String indicating the keys used to navigate a nested/hierarchical
     *                    structure to the point where the update occurred.
     */


    _createClass(RootCursor, [{
        key: 'onChange',
        value: function onChange(changeListener) {
            privateDataMap.get(this).addListener(changeListener);
        }
    }]);

    return RootCursor;
}(Cursor);

exports.default = RootCursor;