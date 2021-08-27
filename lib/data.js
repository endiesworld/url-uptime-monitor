/**
 * Library for storing and editing data
 */

//Dependencies
const fs = require('fs') ;
const path = require('path') ;

//Container for the module (to be exported)
const lib = {} ;

//Generate the absolute directory to the data folder
lib.fileBaseDir = path.join(__dirname, '/../data/') ;

//Write data to a file
lib.create = function (dir, file, data, callback){
    // Open the file for writing.'w': Open file for writing. The file is created (if it does not exist) or truncated (if it exists)
    //'wx': Like 'w' but fails if the path exists.

    fs.open(`${lib.fileBaseDir}${dir}/${file}.json`, 'wx', function(err, fileDescription){
        if(!err && fileDescription){
            //Serialise the data using JSON.stringify
            var stringData = JSON.stringify(data);

            //Write to file and close it
            fs.write(fileDescription, stringData, (err)=>{
                if(!err){
                    fs.close(fileDescription, (err)=>{
                        if(!err){
                            callback(false)
                        }else{
                            callback('Error closing data')
                        }
                    })
                }else{
                    callback('Error writing to new file')
                }
            })

        }else{
            callback('Could not create a new file, the file may already exist')
        }
    })
} ;

// Read data from a file
lib.read = function(dir, file, callBack){
    let path = `${lib.fileBaseDir}${dir}/${file}.json` ;

    fs.readFile(path, 'utf8',function(err, data){
        if(err){
            callBack(true, null)
        }
        else{callBack(err, JSON.parse(data)) }
    })
}

// Update a file
lib.update = function(dir, file, data, callback){
    let path = `${lib.fileBaseDir}${dir}/${file}.json` ;
    fs.open(`${lib.fileBaseDir}${dir}/${file}.json`, 'r+', function(err, fd){
        if(!err && fd){
            var stringData = JSON.stringify(data);
            //Truncate the content of the file before writing into it
            fs.truncate( path,function(err){
                if(!err){
                    fs.write(fd, stringData, (err)=>{
                    if(!err){
                        fs.close(fd, (err)=>{
                            if(!err){
                                callback(false)
                            }else{
                                callback('Error closing data')
                            }
                        })
                    }else{
                        callback('Error writing to existing file')
                    }
            })
                }else{
                    callback('Could not not prepare file for update')
                }
            })
        }else{
            callback('Could not open the file for updating')
        }

    })
}

//Delete a file 
lib.delete = function (dir, file, callback){
    let path = `${lib.fileBaseDir}${dir}/${file}.json` ;
    fs.unlink(path, (err) => {
        if (!err){
            callback(false);
        }else{
            callback(err);
        }
});

}

//Export the module
module.exports = lib ;