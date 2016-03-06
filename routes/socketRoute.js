var handler = function (socket) {
    let handshake = socket.hs,
        socketId = socket.id,
        socket.game = null;
    socket.on('newRoom', gameFactory.createAGame);
    socket.on('joinRoom', gameFactory.joinGame);
    socket.on('invite', invitePlayer);
    socket.on('invited', processInvitation);
    socket.on('start', startTheGame);
    socket.on('gameover', endGame);
    socket.on('move', move);
    socket.on('quit', quit);
    socket.on('disconnected', disconnect);
    socket.on('pause', onpause);
}

module.exports = handler;
