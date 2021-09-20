let puppeteer = require("puppeteer");

(async function fn(){
    try{
        let browser = await puppeteer.launch({
            headless : false,
            defaultViewport : null,
            args : ["--start-maximized", "--disable-notifications"],
        });

        let page = await browser.newPage();
        await page.goto("https://www.google.com/");
        await page.waitForSelector("input[title='Search']");
        await page.type("input[title='Search']", "hackerrank", {delay : 300});
        await page.keyboard.press("Enter");
        await page.waitForSelector("h3 a");
        let hkarr = await page.$$("h3 a");
        await page.click(hkarr[1]);
    }
    catch(err){
        console.log(err);
    }
    
})();

