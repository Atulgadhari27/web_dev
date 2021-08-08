let request = require("request");
let cheerio = require("cheerio");

request("https://www.espncricinfo.com/series/india-tour-of-england-2021-1239527/england-vs-india-1st-test-1239543/full-scorecard", cb);

function cb(err, response, html){

    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        dataExtract(html);
    }
}


function dataExtract(html){

    let searchTool = cheerio.load(html);

    let eleArray = searchTool(".table.bowler tbody tr");
    let hwt = "";
    let wkt = 0;
    for(let i = 0;i < eleArray.length; i++)
    {
        let col = searchTool(eleArray[i]).find("td");
        let name = searchTool(col[0]).text();
        let wicket = searchTool(col[4]).text();
        if(wkt < wicket){
            wkt = wicket;
            hwt = name;
        }
    }
    console.log(hwt + " " + wkt);
}