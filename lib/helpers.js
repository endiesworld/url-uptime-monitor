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

helpers.createRandomString = (number)=>{
    number = typeof number === 'number' ? number : false
    if(number){
        // Define possible string combination
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz123465789ABCDEFGHIJKLMNOPQRSTUVWXYZ' ;
        
        //Start the final string
        let str = ''
        for(let i = 0 ; i<=number ; i++){
            let randomCharacter = possibleCharacters.charAt(Math.random() * possibleCharacters.length)
            str +=randomCharacter
        }
        return str ;
    }else{
        return false
    }
}


module.exports = helpers