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
