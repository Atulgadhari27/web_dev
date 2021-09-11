const { resolve } = require("path");
let puppeteer = require("puppeteer");

let browserStartPromise = puppeteer.launch({
    headless : false,
    defaultViewport : null,
    args : ["--start-maximized", "--disable-notifications"]
});

let page, browser, rTab;
browserStartPromise
    .then(function(browserObj){
        browser = browserObj;

        let browserNewPagePromise = browserObj.newPage();
        return browserNewPagePromise;
    }).then(function(newTab){
        console.log("New Tab opened");

        page = newTab;
        let gPageOpenPromise = newTab.goto("https://www.google.com/");
        return gPageOpenPromise;
    })
    .then(function(){
        console.log("google home page opened");

        let waitforTyping = page.type("input[title='Search']", "pepcoding", {delay : 100});
        return waitforTyping;
    })
    .then(function(){
        let enterPressPromise = page.keyboard.press('Enter', {delay : 100});
        return enterPressPromise;
    })
    .then(function(){
        // wait for the element of the next page to be visible
        let waitforele = waitAndClick(".LC20lb.DKV0Md", page);
        return waitforele;
    })
    .then(function(){
        console.log("Pepcoding.com opened");
        let waitForLoad = page.waitFor(1000);
        return waitForLoad;
    })
    .then(function(){
        let allLisPromise = page.$$(".site-nav-li");
        return allLisPromise;
    })
    .then(function(allEle){
        let eleWillBeClicked = allEle[10].click({delay: 100});
        return eleWillBeClicked;
    })
    .then(function(){
        console.log("Resource Page opened");
        let waitforResource = page.waitFor(2000);
        return waitforResource;
    })
    .then(function(){
        let getAllTabs = browser.pages();
        return getAllTabs;
    })
    .then(function(array){
        rTab = array[array.length - 1];
        let waitForResourceClick = waitAndClick("h2[title='Data Structures and Algorithms in Java [Level 1 - Foundation]']", rTab);
        return waitForResourceClick;
    })
    .then(function(){
        console.log("Level 1 is Opened");
    })




function waitAndClick(selector, cpage){

    return new Promise(function(resolve, reject){

        let waitForPromise = cpage.waitForSelector(selector, {visible : true})
        
        waitForPromise
        .then(function(){
            let clck = cpage.click(selector, {delay : 100});
            return clck;
        })
        .then(function(){
            resolve();
        })
        .catch(function(err){
            reject(err);
        })
    });
}