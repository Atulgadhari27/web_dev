
let puppeteer = require("puppeteer");
let PDFDocument = require('pdfkit');
let fs = require('fs');
let path = require('path');


let contactinfo = [];

(async function fn() {
    try {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized", "--disable-notifications"],
        });

        let page = await browser.newPage();
        await page.goto("https://www.linkedin.com/",);
        await page.waitForSelector(`input[type="text"]`, { visible: true });
        await page.type(`input[type="text"]`, "atulgadhari27@gmail.com", { delay: 100 });
        await page.type(`input[type="password"]`, "Atul@0987", { delay: 100 });
        await page.keyboard.press("Enter");
        console.log("Login Successful");
        await page.waitForSelector(`input[placeholder="Search"]`, { visible: true });
        await page.type(`input[placeholder="Search"]`, "recruiter", { delay: 100 });
        await page.keyboard.press("Enter");
        console.log("Searching for Recruiters")
        await page.waitForSelector(`#search-reusables__filters-bar li`, { visible: true });
        let arr = await page.$$(`#search-reusables__filters-bar li`);
        let ptag;
        for (let i = 0; i < arr.length; i++) {
            let tag = await page.evaluate((ele) => ele.textContent.trim(), arr[i]);
            if (tag == "People") {
                ptag = arr[i];
            }
        }
        await ptag.click();

        await page.waitForSelector(`.entity-result__title-text.t-16`, { visible: true });
        for (let i = 1; i <= 10; i++) {
            await autoScroll(page);
            let linkArr = await page.$$(`.entity-result__title-text.t-16 a`);
            let nameArr = await page.$$(`span[dir='ltr'] span[aria-hidden='true']`);
            let descArr = await page.$$(`.entity-result__primary-subtitle.t-14.t-black.t-normal`);
            // console.log(linkArr.length);
            // console.log(nameArr.length)
            for (let j = 0; j < linkArr.length; j++) {
                let link = await page.evaluate((ele) => ele.getAttribute('href'), linkArr[j]);
                let name = await page.evaluate((ele) => ele.textContent.trim(), nameArr[j]);
                let desc = await page.evaluate((ele) => ele.textContent.trim(), descArr[j]);
                // console.log(name + " "+ link); 
                contactinfo.push({
                    "name": name,
                    "link": link,
                    "desc" : desc,
                });
            }

            console.log("Page " + i + " loaded sucessfully");
            await page.waitForSelector("button[aria-label='Next']");
            await page.click("button[aria-label='Next']");
        }

        console.log("All Data collected");
        makepdf();
       // page.close();
        //browser.close();


    }
    catch (err) {
        console.log(err);
    }
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 400);
        });
    });
}


function makepdf() {
    let pdfDoc = new PDFDocument;
    // let lc = process.cwd();
    // let pdfPath = path.join(lc, "recruiter.pdf");
    pdfDoc.pipe(fs.createWriteStream("recruiter.pdf"));

    pdfDoc.text("List of Recruiters", { align: 'center' });
    pdfDoc.moveDown(2);
    pdfDoc
        .font('Times-Bold')
        .text("Name", {
            bold: true,
            align: 'left',
            continued : true,
        })
        .text("Description", {
            bold: true,
            align: 'center',
        })
        .moveDown(1)

    for (let i = 0; i < contactinfo.length; i++) {
        let namelink = contactinfo[i].link;
        let name = contactinfo[i].name;
        let desc = contactinfo[i].desc;

        pdfDoc
        .font('Times-Roman')
        .text(i + 1 + ". ", {
            continued : true,
        })
        .fillColor('#50b8e7')
        .text(name, {
            link: namelink,
            underline : true,
            align : 'left',
            continued : true,
        })
        .fillColor('black')
        .text(desc, {
            underline: false,
            align : 'center',
            valign: 'center',
        })
        pdfDoc.moveDown(1);

    }
    pdfDoc.end();

}
