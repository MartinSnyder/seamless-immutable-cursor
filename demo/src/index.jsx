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

const rootCursor = new Cursor({
    messages: ['Initialized']
});

rootCursor.onChange((nextData) => {
    ReactDOM.render(<MessageList messages={nextData.messages} />,  document.getElementById('mountPoint'));
});

// TODO: Build your entire application around this concept!
window.setInterval(() => {
    const messageCursor = rootCursor.refine('messages');
    const currentMessages = messageCursor.data;
    messageCursor.data = currentMessages.concat('Pulse: ' + (new Date().getTime() / 1000));
}, 1000);

// For debugging, so you can access the application state in the browser console
window.rootCursor = rootCursor;
