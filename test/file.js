const _data = require('../lib/data') ;

const fileOperations = {} ;

//TESTING 
//writing to file
fileOperations.write = () => _data.create('test-write', 'newFile1', { name: 'Okoro'}, function(err){
    if(!err){
        console.log('Data written successfully')
    }else{
        console.log(err)
    }
});

//updating file
fileOperations.update =() => _data.update('test-write', 'newFile2', {wife: 'Adaobi', age: 29}, function(err){
    if(!err){
        console.log('Data written successfully')
    }else{
        console.log(err)
    }
});

//reading from a file
fileOperations.read =() => _data.read('test-write', 'newFile2', function(err, data){
    if(!err){
        console.log('data read from the file is: ', data)
    }else{
        console.log("No such file exist")
    }
});
 
fileOperations.delete =() => _data.delete('test-write', 'newFile1', function(err){
    if(!err){
        console.log(' The file: newFile has been deleted succes')
    }else{
        console.log(err)
    }
})

module.exports = fileOperations ;