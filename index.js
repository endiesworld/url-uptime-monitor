const http = require('http') ;
const URL = require('url').URL ; 
const url = require('url') ;

const WORK_ENV = 'test' ;

/**
 * 
 * @param {url string} myurl 
 * @returns url parser
 */
const urlParser = (myurl) =>{
    return (WORK_ENV === 'test') ? url.parse(myurl) : new URL(myurl) ;
}

//Create an http serve.
const server = http.createServer((req, res)=>{

    //Get the url and parse it
    var path = '' ;
    try{
        const parsedURL = urlParser(req.url) ;
        path = parsedURL.pathname ;
    }catch(error){
        console.log('url parser error')
    }

    //Get the path
    const trimmedPath = path.replace(/^\/+|\/+$/g,'') ;

    console.log('the requested url is: ', {trimmedPath})

    res.end('Hello world\n') ;
})

//Start server,and have it listen to a port

server.listen(3000, () => console.log('Server running on port 3000'))

