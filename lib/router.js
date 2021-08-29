const _data = require('./data') ;
const helpers = require('./helpers')


var handlers = {} ;

//Ping handler
handlers.ping = (data, callback) =>{
    // Callback a http status code, and a payload object
    callback(200, {'name' : 'sample handler'})
};

//Users handler
// Used as a gateway to confirm all user requested operation is available
handlers.users = (data, callback) =>{
    let acceptableMethods = ['post', 'get', 'put', 'delete'] ;
    if(acceptableMethods.indexOf(data.httpMethod) > -1){
        handlers._users[data.httpMethod](data, callback)
    }else{
        callback(405,{"Error": 'Operation not permited'})
    }
}

handlers._users = {} ;

//users-get
// Required data: phone
//Optional data: none
//@TODO Only let authenticated user access their object.
handlers._users.get = function(data, callback){
    // Check if phone number is valid
    let phone = typeof data.queryString.phone === 'string' && data.queryString.phone.trim().length >= 10 ? data.queryString.phone : false 
    if(phone){
        _data.read('users', phone, function(err, data){
            if(!err && data){
                //Before sending the data back tothe user, remeber to delete encrypted password
                delete data.password
                callback(200, data)
            }else{
                callback(404, {"Error": 'User does not exist in the database'})
            }
        })
    }else{
        callback(400, {"Error": 'Missing the required field'})
    }
}

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
                callback(400, {"Error": `Error creating new user, user ${data} already exist in the data base`})
            }
        })
    }else{
        callback(400, {'Error': 'A field is missing'})
    }
}

//  Users - post
//  Required data: phone
//  Optional data: firstName, lastName, phone, password, tosAgreement
//  @TODO, only allow authenticated users update personal data.
handlers._users.put = function(data, callback){
    //Check for the required field
    let phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone : false 
    
    //Check for the optional fields
    let firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false 
    let lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false 
    let password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false 
    
    //Error if the phone is invalid
    if(phone){
        //Error if nothing is sent to update
        if(firstName || lastName || password){
            // Lookup the user 
            _data.read('users', phone, function(err, userData){
                console.log('OLD DATA IS: ', userData)
                if(!err && userData){
                    if(firstName){
                        userData.firstName = firstName
                    }
                    if(lastName){
                        userData.lastName = lastName
                    }
                    if(password){
                        userData.password = helpers.hashPassword(password)
                    }
                    console.log('NEW DATA IS: ', userData)
                    _data.update('users', phone, userData,function(err){
                        if(!err){
                            callback(200, {message: 'user updated completely'})
                        }else{
                            console.log(err)
                            callback(500,{'Error': 'Could not update file'})
                        }
                    })

                }else{
                    callback(404, {'Error': ' The specified user does not exist'})
                }
            })
        }else{
            callback(400, {'Error': 'Missing field to update'})
        }
    }else{
        callback(400,{'Error': 'Missing fields to update'})
    }
}

// Users -delete
// Required field: phone
// @TODO Only let authenticated user delete their object
// @TODO Cleanup (delete) any other data files associated with this user
handlers._users.delete = function(data, callback){
    console.log('data sent from client: ', data)
    // Check if phone number is valid
    let phone = typeof data.queryString.phone === 'string' && data.queryString.phone.trim().length >= 10 ? data.queryString.phone : false 
    if(phone){
        _data.read('users', phone, function(err, data){
            if(!err && data){
                _data.delete('users', phone, function(err){
                    if(!err){
                        callback(200, {"Message": 'User deleted successfuly'})
                    }else{
                        callback(500,{"Error": 'Could not delete user'})
                    }
                })
            }else{
                callback(404, {"Error": 'User does not exist in the database'})
            }
        })
    }else{
        callback(400, {"Error": 'Missing the required field'})
    }
}

//Tokens
handlers.tokens  = (data, callback) =>{
    let acceptableMethods = ['post', 'get', 'put', 'delete'] ;
    if(acceptableMethods.indexOf(data.httpMethod) > -1){
        handlers._tokens[data.httpMethod](data, callback)
    }else{
        callback(405,{"Error": 'Operation not permited'})
    }
}

//Container for all tokens
handlers._tokens = {} ;

//Token -post
//Required data: phone, password
//Optional data: none
handlers._tokens.post = function(data, callback){
    let phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 10 ? data.payload.phone : false 
    let password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false 
    if(phone && password){
        _data.read('users', phone, function(err, data){
            if(!err && data){
                //Hash password sent then compare to confirm it matches with the existing
                let hasshedPassword = helpers.hashPassword(password) ;
                if(hasshedPassword === data.password){
                    let tokenId = helpers.createRandomString(20) ;
                    let expires = Date.now() + 1000 * 60 * 60 ;
                    let tokenObject = {
                        'phone': phone,
                        'id': tokenId,
                        'expires': expires
                    }
                    _data.create('tokens', tokenId,tokenObject,function(err){
                        if(!err){
                            callback(200, tokenObject)
                        }else{
                            callback(500, {"Error": 'Could not create token'})
                        }
                    })
                }else{
                    callback(400, {"Error": 'Password entered does not match user password'})
                }
                
            }else{
                callback(404, {"Error": 'User does not exist in the database'})
            }
        })
    }else{

    }
};

//Token -get
handlers._tokens.get = function(data, callback){};

//Token -put
handlers._tokens.put = function(data, callback){};

//Token -delete
handlers._tokens.delete = function(data, callback){};

const router = {
    'ping': handlers.ping,
    'users':handlers.users,
    'tokens': handlers.token,
}



module.exports = router