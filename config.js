var config = {
development: {
    mongo_uri : 'mongodb://localhost/test',
    //server details
    server: {
        host: '127.0.0.1',
        port: '8080'
    }
},
production: {

    mongo_uri: process.env.MONGODB_URI,
    //server details
    server: {
        host:   '127.0.0.1',
        port:   process.env.PORT 
    }
}
};
module.exports = config;