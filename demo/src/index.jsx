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
import React from 'react';
import ReactDOM from 'react-dom';
import Cursor from '../../src/index.js'
import MessageList from './MessageList'

// Create a root cursor
const rootCursor = new Cursor({
    messages: ['Initialized']
});

// Register a change handler that renders our page using react. Our React components
// will only 'see' regular JavaScript objects that are runtime-immutable. Any attempts
// by a React component to modify its properties will result in a runtime exception.
rootCursor.onChange((nextData) => {
    ReactDOM.render(<MessageList messages={nextData.messages} />,  document.getElementById('mountPoint'));
});

// TODO: Build your entire application around this concept!
window.setInterval(() => {
    // Every second, we apply a change to a refined cursor. This creates a new generation of our
    // immutable data and triggers a render (via the onChange handler above)
    const messageCursor = rootCursor.refine('messages');
    const currentMessages = messageCursor.data;
    messageCursor.data = currentMessages.concat('Pulse: ' + (new Date().getTime() / 1000));
}, 1000);

// For debugging, so you can access the application state in the browser console
// NOTE: you can do this even when the debugger is not stopped at a breakpoint
window.rootCursor = rootCursor;
