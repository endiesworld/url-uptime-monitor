const crypto = require('crypto');
const config = require('../config') ;


const hmac = crypto.createHmac('sha256', config.hashingSecret);

const helpers = {}

helpers.hashPassword = (password)=>{
    hmac.update(password);
    return hmac.digest('hex');
}

helpers.parseJsonToObject = (str)=>{
    try{
        return JSON.parse(str)
    }catch(e){
        console.log('HELPERS payload is: ',{})
        return {}
    }
}


module.exports = helpers