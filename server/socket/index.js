module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New WS connection')
    console.log(socket.id, ' has made a persistent connection to the server!')

    socket.on('new-message', (message) => {
      socket.broadcast.emit('new-message', message)
    })
  })
}

// module.exports = () => {
//   console.log('hello')
// }
