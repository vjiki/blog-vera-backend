const config = {
    mongo: {
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            socketTimeoutMS: 30000,
            keepAlive: true,
            autoIndex: false,
            retryWrites: false
        },
        url: `mongodb+srv://admin:wwwwww@cluster0.0fywnzn.mongodb.net/blog?retryWrites=true&w=majority`
      },
    server: {
        host: 'localhost',
        port: 3000
    }

};

export default config;