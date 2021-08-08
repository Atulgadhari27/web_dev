let request = require("request");
let cheerio = require("cheerio");

let url = "https://www.espncricinfo.com/series/australia-in-bangladesh-2021-1270832/bangladesh-vs-australia-4th-t20i-1270837/full-scorecard";

request(url, cb);

function cb(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        dataExtractor(html);
    }
}


function dataExtractor(html){
    let searchTool = cheerio.load(html);
    
    let eleArray = searchTool(".table.bowler tbody tr");
    for(let i = 0;i < eleArray.length; i++){
        let col = searchTool(eleArray[i]).find("td");
        let anchor = searchTool(col[0]).find("a");
        let link = anchor.attr("href");

        let fullLink = `https://www.espncricinfo.com${link}`;

        request(fullLink, newcb);
    }
}


function newcb(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        getBirthday(html);
    }
}


function getBirthday(html){
    let $ = cheerio.load(html);
    let arr = $(".player-card-description");
    let name = $(arr[0]).text();
    let birthday = $(arr[1]).text();
    let age = $(arr[2]).text();

    console.log(name + " | " + birthday + " | " + age);
}