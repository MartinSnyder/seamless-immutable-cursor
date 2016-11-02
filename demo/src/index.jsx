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
