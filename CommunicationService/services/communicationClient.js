const socketURL = 'http://localhost:3007';

let userId = Math.floor(Math.random() * 101).toString();
let collaboratorId;
let sessionId = 'aaa111'
console.log('sessionId: ', sessionId);

document.addEventListener('DOMContentLoaded', function () {
    const endButton = document.getElementById('end-call');

    endButton.addEventListener('click', () => {
        console.log('End call!');
        endVideoConnection();
    });
});


// eslint-disable-next-line no-undef
let socket = io(socketURL, { reconnection: true, query: { userId: userId, sessionId: sessionId }});

let peerConnection = new RTCPeerConnection();

let localStream;
let remoteStream;

let isCalling = false;

const streamConstraints = {
    audio: true,
    video: false, // change to false for audio only call
};

const callUser = async () => {
    await setMedia();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit("call", offer);
    console.log(userId, ' call ', collaboratorId);
};

const setMedia = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
        
        const localVideo = document.getElementById("local-video");
        if (localVideo) {
            localVideo.srcObject = localStream;
        }

        localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));
  
    } catch(err) {
      console.log(err);
    }
}

socket.on("collaborator-joined", (collaborator) => {
    collaboratorId = collaborator;

    console.log('collaborator-joined: ', collaboratorId);

    
    const collaboratorContainer = document.getElementById("collaborator-container");
    
    socket.emit('recv-join');

    const collaboratorContainerEl = createCollaboratorItemContainer();
    collaboratorContainer.appendChild(collaboratorContainerEl);
});

socket.on("collaborator-recv-join", (collaborator) => {
    collaboratorId = collaborator;

    console.log('collaborator-recv-join: ', collaboratorId);

    const collaboratorContainer = document.getElementById("collaborator-container");

    const collaboratorContainerEl = createCollaboratorItemContainer();
    collaboratorContainer.appendChild(collaboratorContainerEl);
});

socket.on("collaborator-disconnected", () => {
    console.log('collaborator-disconnected: ', collaboratorId);

    endCommunication();
});

socket.on("collaborator-end-call", () => {
    console.log('collaborator-end-call: ', collaboratorId);

    endVideoConnection();
})

socket.on("called", async (offer) => {
    console.log(userId, ' called by ', collaboratorId);

    if (isCalling) {
        await setVideoConnection(offer);

    } else {
        const acceptButton = document.getElementById('accept-call');
        const collaboratorContainer = document.getElementById("collaborator-container");

        acceptButton.disabled = false;
        collaboratorContainer.style.pointerEvents = 'none';

        acceptButton.addEventListener('click', async () => {
            console.log(userId, ' Accept call!');

            acceptButton.disabled = true;

            const talkingWithInfo = document.getElementById("talking-with-info");
            talkingWithInfo.innerHTML = `Talking with: "Socket: ${collaboratorId}"`;

            await setMedia();

            await setVideoConnection(offer);

            callUser();
            isCalling = true;
    });
    }
});

socket.on("answered", async (answerData) => {
    console.log(collaboratorId, ' answered ', userId);
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answerData)
    );

    if (!isCalling) {
        callUser();
        isCalling = true;
    }
});

socket.on("new-message", (message) => {
    console.log('received new-message: ', message);
});


peerConnection.ontrack = ({ streams: [stream] }) => {
    const remoteVideo = document.getElementById("remote-video");

    remoteStream = stream;

    if (remoteVideo) {
      remoteVideo.srcObject = remoteStream;
    }
};

const setVideoConnection = async(offer) => {
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit("answer", answer);
}

const endCall = () => {
    socket.emit("end-call");
    endVideoConnection();
};

const endVideoConnection = () => {
    const elToRemove = document.getElementById(collaboratorId);
    const endButton = document.getElementById('end-call');

    endButton.disabled = true;
  
    if (elToRemove) {
      elToRemove.remove();
    }

    peerConnection.close();
    peerConnection = null;

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }
};

const endCommunication = () => {
    socket.disconnect();
    socket = null;
};

const createCollaboratorItemContainer = () => {
    const collaboratorContainerEl = document.createElement("div");
  
    const collaboratorNameEl = document.createElement("p");
  
    collaboratorContainerEl.setAttribute("class", "active-collaborator");
    collaboratorContainerEl.setAttribute("id", collaboratorId);

    collaboratorNameEl.setAttribute("class", "collaboratorName");
    collaboratorNameEl.innerHTML = `Call Collaborator: ${collaboratorId}`;
  
    collaboratorContainerEl.appendChild(collaboratorNameEl);
  
    collaboratorContainerEl.addEventListener("click", () => {
        collaboratorContainerEl.setAttribute("class", 
        "active-collaborator active-collaborator--selected");

        const talkingWithInfo = document.getElementById("talking-with-info");
        talkingWithInfo.innerHTML = `Talking with: "Socket: ${collaboratorId}"`;
        
        if (!isCalling) {
            callUser();
            isCalling = true;
        }
    });

    return collaboratorContainerEl;
}
