let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url, getLink);

function getLink(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("PAGE NOT FOUND");
    }
    else{
        findLink(html);
    }
}

function findLink(html){
    let $ = cheerio.load(html);
    let link = $(".widget-items.cta-link>a").attr("href");
    let fullLink = `https://www.espncricinfo.com${link}`;
    
    request(fullLink, getScoreCard);
}

function getScoreCard(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("PAGE NOT FOUND");
    }
    else{
        findScoreCard(html);
    }
}


function findScoreCard(html){
    let $ = cheerio.load(html);
    let allMatches = $(".row.no-gutters .match-cta-container");

    for(let i = 0;i < allMatches.length; i++)
    {
        let match = $(allMatches[i]).find("a");
        let link = $(match[2]).attr("href");
        let fullLink = `https://www.espncricinfo.com${link}`;
        // console.log(fullLink);
        request(fullLink, getResult);
    }
}

function getResult(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("PAGE NOT FOUND");
    }
    else{
        result(html);
    }
}

function result(html){
    let $ = cheerio.load(html);
    let allBatsman = $(".table.batsman tbody tr");
    let names = $(".header-title.label");

    let firstTeam = getName($(names[0]).text());
    let secondTeam = getName($(names[1]).text());

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

    let myTeam = firstTeam;
    let oppTeam = secondTeam
    let cwd = process.cwd();
    let folderPath = path.join(cwd, "IPL");
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }
    for(let i = 0;i < allBatsman.length; i+=2){
        let colArr = $(allBatsman[i]).find("td");
        let name = $(colArr[0]).text();
        name = rName(name);
        if(name == "Extras"){
            i--;
            myTeam = secondTeam;
            oppTeam = firstTeam;
            continue;
        }

        let matchDescription = $(".event .description").text();
        matchDescription = matchDescription.split(",");
        let venue = matchDescription[1].trim();
        let date = matchDescription[2].trim();
        let result = $(".event .status-text").text();

        obj.myTeamName = myTeam;
        obj.name = name;
        obj.venue = venue;
        obj.date = date;
        obj.OpponentTeamName = oppTeam;
        obj.result = result;
        obj.runs = $(colArr[2]).text();
        obj.balls = $(colArr[3]).text();
        obj.fours = $(colArr[5]).text();
        obj.sixes = $(colArr[6]).text();
        obj.sr = $(colArr[7]).text();


        let teamPath = path.join(folderPath, myTeam);
        if(!fs.existsSync(teamPath)){
            fs.mkdirSync(teamPath);
        }
        let playerPath = path.join(teamPath, name + ".json");
        if(!fs.existsSync(playerPath)){
            let input = [];
            input = JSON.stringify(input);
            fs.writeFileSync(playerPath, input);
        }

        let content = fs.readFileSync(playerPath);
        jsonData = JSON.parse(content);

        jsonData.push(obj);

        let jsonWritableData = JSON.stringify(jsonData);
        fs.writeFileSync(playerPath, jsonWritableData);
    }
}

function getName(str){
    let arr = str.split("INNINGS");
    return arr[0];
}

function rName(name){
    let firstSplit = name.split("†");
    let secondSplit = firstSplit[0].split("(c)");
    return secondSplit[0];
}