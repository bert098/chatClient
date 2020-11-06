module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/socket.io': {
        target: 'http://localhost:1337',
        ws: true
      }
    }
  }
}