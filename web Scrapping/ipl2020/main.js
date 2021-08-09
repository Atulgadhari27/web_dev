let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url, cb); // Made the request to the main page given to us.

function cb(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("page not Found");
    }
    else{
        mainPage(html);
    }
}

// Extracted all matches page link from the page given to us
function mainPage(html){
    let $ = cheerio.load(html);
    let mPage = $(".widget-items.cta-link a");
    let allMatchPageLink = mPage.attr("href");
    let fullLink = `https://www.espncricinfo.com${allMatchPageLink}`;

    // Made the request to the all matches page link
    request(fullLink, cb1);
}

function cb1(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("page not Found");
    }
    else{
        allMatches(html);
    }
}


function allMatches(html){
    let $ = cheerio.load(html);
    let matchesArr = $(".match-cta-container");
    
    // Extracted the scorecard page link of an individual match
    for(let i = 0; i < matchesArr.length; i++){
        let temp = $(matchesArr[i]).find("a");
        let linkForIndividualMatch = $(temp[2]).attr("href");
        let fullLink = `https://www.espncricinfo.com${linkForIndividualMatch}`;

        // Made the request to the scorecard page of an individual match
        request(fullLink, cb2);
    }
}

function cb2(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("page not Found");
    }
    else{
        landingPage(html);
    }
}

// This is the final page that we need to work upon - 
function landingPage(html){
    let $ = cheerio.load(html);

    // Extracting teams to know which plays the first Inning
    let teams = $(".Collapsible__trigger.is-open .col>.header-title.label");
    let team1 = $(teams[0]).text().split("INNINGS")[0].trim();
    let team2 = $(teams[1]).text().split("INNINGS")[0].trim();

    let result = $(".event .status-text").text();
    
    let matchDescription = $(".event .description").text();
    matchDescription = matchDescription.split(",");
    let venue = matchDescription[1].trim();
    let date = matchDescription[2].trim();

    let inningsArr = $(".Collapsible");

    // Team that plays the first inning - we made a call for its html data
    extractingPlayers($(inningsArr[0]).html(), team1, result, venue, date, team2);

    // Team that plays the second inning - we made a call for its html data
    extractingPlayers($(inningsArr[1]).html(), team2, result, venue, date, team1);
}

function extractingPlayers(html, myteam, result, venue, date, opponentTeam){
    let $ = cheerio.load(html);

    //Extracting the data of the batting table
    let batsmanTable = $(".table.batsman tbody tr");

    let obj = {
        "myTeamName" : "",
        "name" : "",
        "venue" : "",
        "date" : "",
        "OpponentTeamName" : "",
        "result" : "",
        "runs" : "",
        "balls" : "",
        "fours" : "",
        "sixes" : "",
        "sr" : ""
    };


    //Loop on the battingArr for appending all the information in the JSON file
    for(let i = 0; i < batsmanTable.length - 1; i += 2){
        let colArr = $(batsmanTable[i]).find("td");

        obj.myTeamName = myteam;
        obj.name = $(colArr[0]).find("a").attr("title").split(" ").splice(4).join(" ");
        obj.venue = venue;
        obj.date = date;
        obj.OpponentTeamName = opponentTeam;
        obj.result = result;
        obj.runs = $(colArr[2]).text();
        obj.balls = $(colArr[3]).text();
        obj.fours = $(colArr[5]).text();
        obj.sixes = $(colArr[6]).text();
        obj.sr = $(colArr[7]).text();

        let cwd = process.cwd();
        let ipl = path.join(cwd, "IPL");
        if(fs.existsSync(ipl) == false){
            fs.mkdirSync(ipl);
        }
        
        let teamPath = path.join(ipl, obj.myTeamName);
        if(fs.existsSync(teamPath) == false){
            fs.mkdirSync(teamPath);
        }

        let playerFilePath = path.join(teamPath, obj.name + ".json");
        if(fs.existsSync(playerFilePath) == false){
            let input = [];
            input = JSON.stringify(input);
            fs.writeFileSync(playerFilePath, input);
        }

        // First reading all content of JSON file
        let content = fs.readFileSync(playerFilePath);
        let jsonData = JSON.parse(content); // Converting that data into the readable format
        jsonData.push(obj); // Pushing the object in the readable data
        let jsonWritableData = JSON.stringify(jsonData); // Again converting that readable data into the JSON writable format
        fs.writeFileSync(playerFilePath, jsonWritableData); // Writing that JSON data in the file
    }
}