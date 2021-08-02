const openssl = require('openssl-nodejs') ;

openssl('openssl req -config csr.cnf -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem') ;