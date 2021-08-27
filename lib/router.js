const _data = require('./data') ;
const helpers = require('./helpers')


var handlers = {} ;

//Ping handler
handlers.ping = (data, callBack) =>{
    // Callback a http status code, and a payload object
    callBack(200, {'name' : 'sample handler'})
};

handlers.users = (data, callback) =>{
    let acceptableMethods = ['post', 'get', 'put', 'delete'] ;
    if(acceptableMethods.indexOf(data.httpMethod) > -1){
        console.log('the http methos sent to router is: ', data.httpMethod)
        handlers._users[data.httpMethod](data, callback)
    }else{
        callback(405)
    }
}

handlers._users = {} ;
handlers._users.get = function(data, callback){}

//  Users - post
//  Required data: firstName, lastName, phone, password, tosAgreement
//  Optional data: none
handlers._users.post = function(data, callback){
    let firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false 
    let lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false 
    let phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone : false 
    let password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false 
    let tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement === true ? true : false ;
    console.log('Sent in data: ', {firstName, lastName, phone, password, tosAgreement})
    if(firstName && lastName && phone && password && tosAgreement){
        _data.read('users', phone, function(err, data){
            if(err){
                var hashedPassword =  helpers.hashPassword(password)
                if(hashedPassword){

                    _data.create('users', phone, {firstName, lastName, phone, password: hashedPassword, tosAgreement  }, function(err){
                        if(!err){
                            callback(200, {message: 'User created successfully'})
                        }else{
                            console.log(err)
                            callback(500, {Error: 'Server could not create the new user'})
                        }
                    })
                }else{
                    callback(500, {Error: 'Server could not create the new user'})
                }
                
            }else{
                callback(400, `Error creating new user, user ${data} already exist in the data base`)
            }
        })
    }else{
        callback(400, {'Error': 'A field is missing'})
    }
}
handlers._users.put = function(data, callback){}
handlers._users.delete = function(data, callback){}


const router = {
    'ping': handlers.ping,
    'users':handlers.users,
}



module.exports = router