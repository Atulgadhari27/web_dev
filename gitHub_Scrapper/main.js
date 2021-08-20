let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");

let url = "https://github.com/topics";
request(url, cb);

function cb(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        topicsPage(html);
    }
}

function topicsPage(html){
    let $ = cheerio.load(html);
    let topicsArr = $(".topic-box a");
    for(let i = 0; i < 3; i++)
    {
        let path = $(topicsArr[i]).attr("href");
        let fullLink = `https://github.com${path}`;
        request(fullLink, repo);
    }
}

function repo(err, response, html){
    if(err){
        console.log(err);
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
        repoPage(html);
    }
}

function repoPage(html){
    let $ = cheerio.load(html);
    let repoArr = $("article .px-3 h3 a.text-bold");

    let techName = $("h1.h1").text().trim();

    let cwd = process.cwd();
    let folderPath = path.join(cwd, "gitHub_Scrapper", techName);
    //console.log(folderPath);
    fs.mkdirSync(folderPath);
    for(let i = 0; i < 8; i++){
        let repoName = $(repoArr[i]).text().trim();
        let filePath = path.join(folderPath, repoName + ".json");
        let input = [];
        input = JSON.stringify(input);
        fs.writeFileSync(filePath, input);
        let link = $(repoArr[i]).attr("href");
        let fullLink = `https://github.com${link}/issues`;
        
        request(fullLink, issueCb1(filePath));
    }
}
function issueCb1(filePath){
    return function issueCb(err, response, html){
        if(err){
            console.log(err);
        }
        else if(response.statusCode == 404){
            console.log("Page Not Found");
        }
        else{
            issuePage(html, filePath);
        }
    }
}


function issuePage(html, filePath){
    let $ = cheerio.load(html);
    let issuesArr = $(".h4");
    for(let i = 0; i < issuesArr.length; i++){
        let content = fs.readFileSync(filePath);
        let jsonData = JSON.parse(content);
        let path = $(issuesArr[i]).attr("href");
        //console.log(path);
        jsonData.push(path);

        let jsonWritableData = JSON.stringify(jsonData);
        fs.writeFileSync(filePath,jsonWritableData);
    }
}





