var handlers = {} ;

//Ping handler
handlers.ping = (data, callBack) =>{
    // Callback a http status code, and a payload object
    callBack(200, {'name' : 'sample handler'})
};

const router = {
    'ping': handlers.ping 
}



module.exports = router