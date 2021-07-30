var handlers = {} ;

handlers.sample = (data, callBack) =>{

    // Callback a http status code, and a payload object
    callBack(406, {'name' : 'sample handler'})
};

const router = {
    'sample': handlers.sample 
}

module.exports = router