document.addEventListener("DOMContentLoaded", function() {
    const VidoBody = document.getElementById("videos");
    const MyVido = document.createElement('video');
    MyVido.muted = true;

    // Get the ROOM_ID from the HTML
    const ROOM_ID = document.querySelector("#roomId").textContent;
    const userId = 10;

    const socket = io('/');
    const myPeer = new Peer(undefined, {
        host: "/", 
        port: "3001"
    });

    myPeer.on('open', id => {
        socket.emit('join-room', ROOM_ID, id);
        console.log("New User Connected:", id);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        addvideoStream(MyVido, stream);
        myPeer.on('call', call => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on('stream', userVideoStream => {
                addvideoStream(video, userVideoStream);
            });
            call.on('close', () => {
                video.remove();
            });
        });
        socket.on('user-joined', id => {
            connectTONewUser(id, stream);
        });
    });

    socket.emit('join-room', ROOM_ID, userId);

    socket.on('user-joined', (userId) => {
        console.log('User connected:', userId);
        // Handle the event here if needed
    });

    function addvideoStream(video, stream) {
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
        VidoBody.append(video);
    }

    function connectTONewUser(userId, stream) {
        const call = myPeer.call(userId, stream);
        const video = document.createElement("video");
        call.on('stream', userVideoStream => {
            addvideoStream(video, userVideoStream);
        });
        call.on('close', () => {
            video.remove();
        });
    }
});
0