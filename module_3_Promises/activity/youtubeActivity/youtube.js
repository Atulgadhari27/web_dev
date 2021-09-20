let puppeteer = require("puppeteer");


(async function fn(){

    let browser = await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        args: ["--start-maximized", "--disable-notifications"],
    });

    let page = await browser.newPage();
    await page.goto("https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq");
    await page.waitForSelector('h1[id="title"]');
    let element = await page.$('h1[id="title"]');

    let name = await page.evaluate(
        function(element){
            return element.textContent;
        },
        element
    );

    console.log("Name of Playlist: " + name);
    let elementArr = await page.$$(".style-scope.ytd-playlist-sidebar-primary-info-renderer");
    let Videos = await page.evaluate((element) => element.textContent, elementArr[5]);
    console.log("No of Videos: " + Videos);
    let views = await page.evaluate((element) => element.textContent, elementArr[6]);
    console.log("No of Views: " + views);

    let noOfVideos = Videos.split(" ")[0].trim();
    let spinnings = Math.floor(noOfVideos / 100);

    for(let i = 1; i <= spinnings; i++){
        await page.click(".circle.style-scope.tp-yt-paper-spinner");
        await waitTillHTMLRendered(page);
        console.log("loaded new videos");
    }
    
    let nameArr = await page.$$('a[id="video-title"]');
    let lastVideo = nameArr[nameArr.length - 1];
    await page.evaluate((ele) => {
        ele.scrollIntoView();
    }, lastVideo);
    await page.waitFor(1000);
    let timeArr = await page.$$('span[id="text"]');
    let videoArr = [];

    for(let i = 0; i < nameArr.length; i++){
        let timeAndNameObj;
        if(i > 163){
            timeAndNameObj = await page.evaluate(findTitleAndTime,timeArr[i - 1], nameArr[i]);
        }
        else{
            timeAndNameObj = await page.evaluate(findTitleAndTime,timeArr[i], nameArr[i]);
        }
        //console.log(timeAndNameObj);
        videoArr.push(timeAndNameObj);
    }

    console.table(videoArr);
})();

function findTitleAndTime(ele1, ele2){
    return{
        time: ele1.textContent.trim(),
        title: ele2.textContent.trim()
    }
}

const waitTillHTMLRendered = async (page, timeout = 10000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
    while (checkCounts++ <= maxChecks) {
        // html
        let html = await page.content();
        let currentHTMLSize = html.length;
        // body part
        //console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize);
        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            //console.log("Page rendered fully..");
            break;
        }
        lastHTMLSize = currentHTMLSize;
        await page.waitFor(checkDurationMsecs);
    }
};