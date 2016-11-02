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

class PrivateData {
    constructor(currentData) {
        this.currentData = Immutable(currentData);
        this.changeListeners = [];
    }

    update(path, newValue) {
        const prevData = this.currentData;
        const nextData = this.currentData.setIn(path, newValue);

        // Fire notification
        for (let changeListener of this.changeListeners) {
            changeListener(nextData, prevData, path);
        }

        this.currentData = nextData;
    }

    /*
     * function changeListener(prevRoot, nextRoot, pathUpdated)
     */
    addListener(changeListener) {
        this.changeListeners.push(changeListener);
    }
}

const privateDataMap = new WeakMap();

class Cursor {
    constructor(privateData, path) {
        privateDataMap.set(this, privateData);
        this.path = path;

        Object.freeze(this);

        // We don't want to freeze in this constructor because
    }

    get data() {
        let pointer = privateDataMap.get(this).currentData;
        for (let el of this.path) {
            pointer = pointer
                ? pointer[el]
                : undefined;
        }

        return pointer;
    }

    set data(newValue) {
        privateDataMap.get(this).update(this.path, newValue);
    }

    refine(subPath) {
        if (subPath.length === 0) {
            return this;
        }
        else {
            return new Cursor(privateDataMap.get(this), this.path.concat(subPath));
        }
    }
}

export default class RootCursor extends Cursor {
    constructor(initialRoot = {}) {
        super(new PrivateData(initialRoot), []);
    }

    /*
     * function changeListener(nextRoot, prevRoot, pathUpdated)
     */
    onChange(changeListener) {
        privateDataMap.get(this).addListener(changeListener);
    }
}
