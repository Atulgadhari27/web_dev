let puppeteer = require("puppeteer");

let browser = puppeteer.launch({
    headless : false,
    defaultViewport : null,
    args : ["--start-maximized", "--disable-notifications"]
});