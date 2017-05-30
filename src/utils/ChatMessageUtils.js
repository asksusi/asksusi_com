export function convertRawMessage(rawMessage, currentThreadID) {
  return {
    ...rawMessage,
    date: new Date(rawMessage.timestamp),
    isRead: rawMessage.threadID === currentThreadID
  };
};

export function getCreatedMessageData(text, currentThreadID) {
  var timestamp = Date.now();
  return {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'You',
    date: new Date(timestamp),
    text: text,
    isRead: true
  };
};

export function getSUSIMessageData(message, currentThreadID) {
  var timestamp = Date.now();

  let receivedMessage =  {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'SUSI', // hard coded for the example
    text: message.text,
    response: message.response,
    date: new Date(timestamp),
    isRead: true,
    responseTime: message.responseTime
  };

  return receivedMessage;
}


