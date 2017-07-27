import chai from 'chai';
import Cursor from '../src/index';

const assert = chai.assert;

describe('Data object with primitive', () => {
    const cursor = new Cursor('primitive');
    it('constructs cleanly', () => assert.equal('primitive', cursor.data));
});

describe('Data object with structure', () => {
    const cursor = new Cursor({
        attr: 'structured'
    });
    it('constructs cleanly', () => assert.equal('structured', cursor.data.attr));
    it('exposes root attribute immutably', () => chai.expect(() => cursor.data.attr = 'updated').to.throw());
});

describe('Multiple Data classes', () => {
    const one = new Cursor('one');
    const two = new Cursor('two');

    it('Maintain their data independently (WeakMap test)', () => {
        assert.equal('one', one.data);
        assert.equal('two', two.data);
        assert.notEqual(one.data, two.data);
    });
});

describe('Root Cursors', () => {
    const root = new Cursor({
        interior: null
    });

    it('Allows replacement of data', () => {
        root.data = {
            interior: 5
        };
    });

    it('Replaces data with immutable objects', () => {
        root.data = {
            interior: 5
        };

        chai.expect(() => cursor.data.interior = 6).to.throw();
    });
});

describe('Cursors', () => {
    const nested = new Cursor({
        top: {
            middle: {
                bottom: 'nestedValue'
            }
        }
    });

    let changes = [];
    const changeHandler = (nextRoot, prevRoot, pathUpdated) =>
        changes.push({
            prevRoot: prevRoot,
            nextRoot: nextRoot,
            pathUpdated: pathUpdated
        });
    nested.onChange(changeHandler);

    it('Descends structures correctly', () => assert.equal('nestedValue', nested.refine(['top', 'middle', 'bottom']).data));
    it('Safely returns if the path does not exist', () => assert.equal(undefined, nested.refine(['one', 'two', 'three']).data));
    it('Can be refined to produce new cursors', () => assert.equal('nestedValue', nested.refine(['top']).refine(['middle', 'bottom']).data));
    it('Can be used to update the managed data object', () => {
        const cursor = nested.refine(['top', 'middle', 'bottom']);
        cursor.data = 'updated';

        assert.equal('updated', cursor.data);
    });
    it('Can be used to add to the data object', () => {
        const cursor = nested.refine(['one', 'two', 'three']);
        cursor.data = 'added';

        assert.equal('added', cursor.data);
    });
    it('Makes added elements immutable as well', () => chai.expect(() => nested.root.one.two.three = 'updated').to.throw());
    it('Fires change events correctly', () => {
        assert.equal(2, changes.length);

        // Verify first change
        assert.equal('nestedValue', changes[0].prevRoot.top.middle.bottom);
        assert.equal('updated', changes[0].nextRoot.top.middle.bottom);
        assert.deepEqual(['top', 'middle', 'bottom'], changes[0].pathUpdated);

        // Verify Second change
        assert.equal(undefined, changes[1].prevRoot.one);
        assert.equal('added', changes[1].nextRoot.one.two.three);
        assert.deepEqual(['one', 'two', 'three'], changes[1].pathUpdated);
    });
    it('removes change listeners correctly', () => {
        nested.removeListener(changeHandler);

        const cursor = nested.refine(['top', 'middle', 'bottom']);
        cursor.data = 'second update';

        // Verify change does not happen
        assert.equal(undefined, changes[3]);
    });
});
