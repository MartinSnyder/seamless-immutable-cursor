/*
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
import Immutable from 'seamless-immutable';

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
class PrivateData {
    constructor(initialData) {
        this.currentData = initialData;
        this.changeListeners = [];
    }

    /*
     * Updates the portion of this.currentData referenced by 'path' with the 'newValue'
     */
    update(path, newValue) {
        // this.currentData is about to become the "previous generation"
        const prevData = this.currentData;

        // Apply the update to produce the next generation. Because this.currentData has
        // been processed by seamless-immutable, nextData will automatically be immutable as well.
        this.currentData = this.currentData.setIn(path, newValue);

        // Notify all change listeners
        for (let changeListener of this.changeListeners) {
            // Pass nextData first because many listeners will ONLY care about that.
            changeListener(this.currentData, prevData, path);
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
    addListener(changeListener) {
        this.changeListeners.push(changeListener);
    }
}

/*
 * ES6 classes don't have a direct provision for private data, but we can associate data
 * with a class via a WeakMap and hide that WeakMap within the module.
 *
 * This WeakMap is of mapping of Cursor->PrivateData
 */
const privateDataMap = new WeakMap();

/*
 * Implementation of a cursor referencing an evolving immutable data structure.
 *
 * Note that callers of this module CAN receive instances of this class through
 * the normal usage pattern of constructing a 'RootCursor' object and then
 * calling 'refine', but they cannot construct them on their own.
 */
class Cursor {
    /*
     * This class is private to the module, so its constructor is impossible to
     * invoke externally. This is good since the "privateData" parameter of the
     * constructor is not something we want external callers to attempt to provide.
     */
    constructor(privateData, path) {
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
    get data() {
        // I didn't see a 'getIn' method in seamless-immutable that was publicly accessible
        // So I rolled my own
        let pointer = privateDataMap.get(this).currentData;
        for (let el of this.path) {
            pointer = pointer
                ? pointer[el]
                : undefined;
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
    set data(newValue) {
        privateDataMap.get(this).update(this.path, newValue);
    }

    /*
     * Create a new child cursor from this cursor with the subPath appended to our current path
     */
    refine(subPath) {
        if (subPath.length === 0) {
            return this;
        }
        else {
            // Because this.path is already immutable, this.path.concat returns
            // a new immutable array.
            return new Cursor(privateDataMap.get(this), this.path.concat(subPath));
        }
    }
}

/*
 * Public entry into this module.
 *
 * RootCursor objects are the same as regular cursor objects except that:
 * 1. The 'root' cursor can be constructed by external callers
 * 2. The 'root' cursor can register changeListeners
 */
export default class RootCursor extends Cursor {
    constructor(initialRoot = {}) {
        // Use seamless-immutable to constrain the initial data. This is the only
        // place where we invoke seamless-immutable because once we do this, our
        // interactions with these objects will only spawn other immutable objects
        super(new PrivateData(Immutable(initialRoot)), Immutable([]));
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
    onChange(changeListener) {
        privateDataMap.get(this).addListener(changeListener);
    }
}
