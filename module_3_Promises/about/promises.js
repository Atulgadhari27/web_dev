
const { Console } = require("console");
let fs = require("fs");

function myPromiseReader(filepath){

    return new Promise(function (resolve, reject){          // returning a Promise which takes two function parameters
        fs.readFile(filepath, function cb(err, data){
            if(err){
                reject(err);                       /// calling reject function if error occured;
            }
            else{
                resolve(data);              // calling resolve function if no error occured;
            }
        })
    });
}

let filedata = myPromiseReader("f1.txt");    // the reading of file takes some time so function execution and reading
                                            // file will execute parallely;

console.log("Before SetTimeOut: ", filedata);    // hence your promise of reading file is still pending;

setTimeout(function(){
    console.log("In SetTimeOut: ", filedata);    // here file reading will be completed;
                                                // if setTimeout is so less then also it will show as promise pending
}, 100);

console.log("After SetTimeOut: ", filedata);       // this will also shows as pending because reading file is
                                                    // called in a callback function so this line will execute first

let freadPromise = fs.promises.readFile("f1.txt");


// using setTimeout is a bad practice as file may take more time to be read than the setTimeout

console.log("Before then Function");

// NOTE : then function is syncronous but cb is asyncronous;
filedata.then(function cb(data){
    console.log("Data using callBack function: " + data);
});

console.log("After then Function");





