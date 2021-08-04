const http = require('http') ;
const https = require('https') ;
const URL = require('url').URL ; 
const url = require('url') ;
const StringDecoder = require('string_decoder').StringDecoder ;
const fs = require('fs') ;

const router = require('./router') ;
const env = require('./config')

const WORK_ENV = env.envName ; 
const HTTPPORT = env.httpPort ;
const HTTPSPORT = env.httpsPort ;


/**
 * 
 * @param {url string} myurl 
 * @returns url parser
 */
const urlParser = (myurl) =>{
    return (WORK_ENV === 'staging') ? url.parse(myurl) : new URL(myurl) ;
}

const pageNotFound = (data , callBack) => callBack(404) 

//Create a unified server logi for both http and https
const unifiedServer = (req, res)=>{

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

        //Choose the handler this request should go to. or return page not found whent route does not exist.
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : pageNotFound

        //Construct the data object to send to the handler
        const handlerData ={
            trimmedPath,
            queryString,
            httpMethod,
            reqHeaders,
            "payload": buffer
        };

        //Route the request to the handler specified in the router
        chosenHandler(handlerData, function(statusCode, payload){

            console.log('the type of status code: ', typeof(statusCode), 'and value is: ', statusCode)
            //Use the status code called back by the handler, or default to 200
            let resStatusCode = typeof(statusCode) === 'number'  ? statusCode : 200

            //Use the payload called by the handler or defualt to empty object 
            let resPayload = typeof(payload) === 'object' ? payload : {} ; 

            //Convert the payload to a string
            let payloadString = JSON.stringify(resPayload) ;

            //Return the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(resStatusCode) ;
            res.end(payloadString) ;

            console.log('Returning this response: ', resStatusCode, payloadString)
        })
    })
}

//Create an http serve.
const httpServer = http.createServer((req, res) => {(unifiedServer(req, res))}) ;

//Create an https serve.
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem', 'utf8') ,
    'cert': fs.readFileSync('./https/server.crt', 'utf8')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {(unifiedServer(req, res))}) ;

//Start server,and have it listen to a port
httpServer.listen(HTTPPORT, () => console.log('Server running on port: ', HTTPPORT)) ;

//Start server,and have it listen to a port
httpsServer.listen(HTTPSPORT, () => console.log('Server running on port: ', HTTPSPORT)) ;

console.log('process env accesed from index file is: ', process.env.NODE_ENV.toLowerCase()) ;
