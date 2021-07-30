const http = require('http') ;
const URL = require('url').URL ; 
const url = require('url') ;
const StringDecoder = require('string_decoder').StringDecoder ;

const router = require('./router') ;

const WORK_ENV = 'test' ;

const pageNotFound = (data, callBack) =>{
    callBack(404)
}

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
    
    var parsedURL = '' ;
    try{
        parsedURL = urlParser(req.url) ;
    }catch(error){
        console.log('url parser error')
    }

    //Get the path
    var path = parsedURL.pathname ;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'') ;

    //Get the HTTP method requested for
    const httpMethod = req.method.toLowerCase();

    //Get query string from url paramater
    const queryString = parsedURL.query ;

    //Get request headers
    const reqHeaders = req.headers

    //Get request payload. HTTP request are also node stream. To read the payload data, its advisable to read as stream.
    // when reading data as stream, you use node string decoder library for proper formating.
    const decoder = new StringDecoder('utf-8');
    var buffer = '' ;

    
    //Once any data comes in, decode the data, and add to the buffer.
    req.on('data', (data) =>{
        buffer += decoder.write(data)
    }) ;

    req.on('end' , () =>{
        buffer += decoder.end() ;

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : ()=> pageNotFound()
        const logMessage = `the requested url is: ${trimmedPath}, the requested HTTP method is: ${httpMethod},
        requested query is  ${queryString}, and the request header is given as ${reqHeaders}, and payload is: ${buffer}, the chosenHandler is: ${chosenHandler}`

        res.end(logMessage) ;
        console.log(reqHeaders)
    })


    
})

//Start server,and have it listen to a port

server.listen(3000, () => console.log('Server running on port 3000'))

