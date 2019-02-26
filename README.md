# seamless-immutable-cursor
Compact Cursor Library built on top of the excellent [seamless-immutable][seamless-immutable-github].
Cursors can be used to manage transitions and manipulations of immutable structures in an application.

## Presentation
A [20 minute presentation](https://youtu.be/wQy5vxzNdV0) explains the utility of this library and the repository contents. [Slides can be viewed here](https://martinsnyder.net/presentations/revealjs/seamless-immutable-cursor.html)

# Example
```javascript
const rootCursor = new Cursor({
    users: {
        abby: 1,
        ben: 2,
        claire: 3,
        dan: 4
    },
    documents: [
        {
            name: 'CV',
            owner: 1,
            mediaType: 'application/pdf'
        },
        {
            name: 'References',
            owner: 1,
            mediaType: 'text/plain'
        }
    ]
});

// Register a function to react to new generations of our immutable data
rootCursor.onChange((nextData, prevData, pathUpdated) => {
    console.debug('Updated ' + JSON.stringify(pathUpdated));
});

// Create a cursor for a limited portion of our data hierarchy
const childCursor = rootCursor.refine(['documents', 0, 'name']);

// firstDocumentName will be 'CV'
const firstDocumentName = childCursor.data;

// Update -- this switches the data owned by rootCursor to point to
// a new generation of immutable data
childCursor.data = 'Resume';

// updatedFirstDocumentName will be 'Resume' because the cursor points
// to the location, not the specific data
const updatedFirstDocumentName = childCursor.data;

// updatedFirstDocumentNameFromRoot will ALSO be 'Resume' because the
// 'managed' data has moved to a new generation based on the prior update
const updatedFirstDocumentNameFromRoot = rootCursor.data.documents[0].name;
```

# React Demo
The demo folder contains a simple demo that combines this library, seamless-immutable and React.

[seamless-immutable-github]: https://github.com/rtfeldman/seamless-immutable
