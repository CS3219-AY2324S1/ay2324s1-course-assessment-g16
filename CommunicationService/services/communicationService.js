const communicationPair = new Map();
const messageLog = new Map();

const startCommunication = async(socket) => {

    const sessionId = socket.handshake.query.sessionId;
    const userId = socket.handshake.query.userId;

    let collaborators;

    socket.join(sessionId);
    socket.emit('join', sessionId);

    if (!messageLog.has(sessionId)) {
        messageLog.set(sessionId, []);
    }

    if (communicationPair.has(sessionId)) {
        collaborators = communicationPair.get(sessionId);

        if (collaborators && !collaborators.includes(userId)) {
            collaborators.push(userId);
            communicationPair.set(sessionId, collaborators);

            socket.to(sessionId).emit('collaborator-joined', userId);
        }
    } else {
        collaborators = [userId]
        communicationPair.set(sessionId, collaborators);
    }

    socket.on('recv-join', () => {
        console.log('recv-join from ', userId);
        socket.to(sessionId).emit('collaborator-recv-join', userId);
    });

    socket.on('message', (message) => {
        console.log(userId, ' sends message ', message);

        let messages = messageLog.get(sessionId);

        let newMessage = { text: message.text, sender: userId };

        messages.push(newMessage);
        messageLog.set(sessionId, messages);

        socket.to(sessionId).emit('new-message', newMessage);
    });

    socket.on('get-message-log', () => {
        console.log('get-message-log from ', userId);

        socket.emit('recv-message-log', retrieveMessageLog(sessionId));
    });

    socket.on('call', (offer) => {
        console.log(userId, ' calls collaborator');
        socket.to(sessionId).emit('called', offer);
    });

    socket.on('answer', (answer) => {
        console.log(userId, ' answers call');
        socket.to(sessionId).emit('answered', answer);
    });

    socket.on('end-call', () => {
        console.log(userId, ' ends call');

        socket.to(sessionId).emit('collaborator-end-call');
    });

    socket.on('reject-call', () => {
        console.log(userId, 'rejected call');
        socket.to(sessionId).emit('call-rejected');
      });
      

    socket.on('disconnect', () => {
        console.log(userId, ' disconnect');
        endCommunication(sessionId);
        socket.to(sessionId).emit('collaborator-disconnected');
    });

    socket.on('ice-candidate', (data) => {
        console.log(userId, ' sends ice candidate');
        socket.to(sessionId).emit('ice-candidate', data);
    });
    

}

const retrieveMessageLog = (sessionId) => {
    console.log('retrieveMessageLog for session: ', sessionId);

    if (messageLog.has(sessionId)) {
        return messageLog.get(sessionId);

    } else {
        return [];
    }
}

const endCommunication = (sessionId) => {
    communicationPair.delete(sessionId);
    messageLog.delete(sessionId);
}

module.exports = {
    startCommunication
}