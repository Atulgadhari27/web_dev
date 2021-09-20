
let puppeteer = require("puppeteer");

let browserStartPromise = puppeteer.launch({
    headless : false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
});

(async function fn(){
    try{
        let browserObj = await browserStartPromise;
        let page = await browserObj.newPage();
        await page.goto("https://www.google.com/");
        await page.type('input[title="Search"]', "pepcoding", {delay: 100});
        await page.keyboard.press("Enter");
        await waitAndClick(".LC20lb.DKV0Md", page);
        await page.waitForSelector(".site-nav-li", {visible: true});   // waiting for the page to load if not wait then arr will have undefined value
        let arr = await page.$$(".site-nav-li", {delay: 100});
        await arr[10].click({delay: 100});
        await page.waitFor(1000);
        let allPages = await browserObj.pages();
        page = allPages[allPages.length - 1];
        await waitAndClick("h2[title='Data Structures and Algorithms in Java [Level 1 - Foundation]']", page);
    }
    catch(err){
        console.log(err);
    }
})();


function waitAndClick(selector, page){

    return new Promise(function(resolve, reject){

        let waitForClick = page.waitForSelector(selector, {visible: true});

        waitForClick
            .then(function(){
                let clickPromise = page.click(selector);
                return clickPromise;
            })
            .then(function(){
                resolve();
            })
            .catch(function(err){
                reject(err);
            })
    });
}