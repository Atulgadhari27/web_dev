let fs = require("fs");
let axios = require("axios");

let pPromise = fs.promises.readFile("f1.txt");

pPromise.then(function(data){
    console.log("Data: " + data);
})

