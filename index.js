const http = require('http') ;

//Create an http serve.
const server = http.createServer((req, res)=>{
    res.end('Hello world\n') ;
})

//Start server,and have it listen to a port

server.listen(3000, () => console.log('Server running on port 3000'))

