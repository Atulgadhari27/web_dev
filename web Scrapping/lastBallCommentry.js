let request = require("request");
let cheerio = require("cheerio");

request("https://www.espncricinfo.com/series/india-tour-of-england-2021-1239527/england-vs-india-1st-test-1239543/live-cricket-score", cb);

function cb(err, response, html){

    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        console.log("all Data is in html");
        dataExtract(html);
    }
}


function dataExtract(html){

    let searchTool = cheerio.load(html);

    let eleArray = searchTool(".match-comment-wrapper .match-comment-long-text p");

    let lastCmt = searchTool(eleArray[0]).text().trim();

    console.log(lastCmt);
}