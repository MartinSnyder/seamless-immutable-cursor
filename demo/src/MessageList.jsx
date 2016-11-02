import React from 'react';

const MessageList = ({messages}) => {
    let i = 0;
    const messageMarkup = messages.map(message =>
        <div key={i++}>{message}</div>
    );

    return <div key="messageList" className="messageList">{messageMarkup}</div>;
};

MessageList.propTypes = {
    messages: React.PropTypes.array.isRequired
};

export default MessageList;
