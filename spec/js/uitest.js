const assert = require('chai').assert;
const puppeteer = require('puppeteer');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect']);
const opts = {
    headless: false,
    slowMo: 200,
    timeout: 10000
  };
before (async function () {
    global.browser = await puppeteer.launch(opts);
});
after (function(){
    browser.close();
    global.browser = globalVariables.browser;
})
describe("sample test", function(){
    it("should run the browser", async function(){
        console.log(await browser.version());
        assert.equal(true,true);
    });
});
describe("heading tests", function(){
    let page;
    before (async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:8000');
    });
    after (async function () {
        await page.close();
    });
    it ("should test main heading", async function(){
        const headingValue = await page.$eval('.main_heading', el => el.innerHTML);
        assert.equal(headingValue," Simple Data Grapher");
    });
    it ("should test sub heading", async function(){
        const headingValue = await page.$eval('.sub_heading', el => el.innerHTML);
        assert.equal(headingValue,"Plot and Export Graphs with CSV data");
    });
    it ("should test indicator-1 heading", async function(){
        const headingValue = await page.$eval('.item-1', el => el.innerHTML);
        assert.equal(headingValue,"Upload CSV Data");
    });
    it ("should test indicator-2 heading", async function(){
        const headingValue = await page.$eval('.item-2', el => el.innerHTML);
        console.log(headingValue);
        assert.equal(headingValue,"Select Columns &amp; Graph Type");
    });
    it ("should test indicator-3 heading", async function(){
        const headingValue = await page.$eval('.item-3', el => el.innerHTML);
        assert.equal(headingValue,"Plotted Graph &amp; Export Options");
    });
});
describe("csv string file upload test", function(){
    let page;
    before (async function () {
        page = await browser.newPage();
        await page.goto('http://localhost:8000');
        const fileInput=await page.$('.csv_string');
        await fileInput.type("A,2,3");
        await fileInput.press('Enter');
        // await fileInput.uploadFile("../../examples/test.csv");
        const uploadButton=await page.$('.uploadButton');
        await uploadButton.click();
        // const second_indicator=await page.$('.second_indicator');
        // await second_indicator.click();
    });
    after (async function () {
        await page.close();
    });
    it("should test toggle button: on", async function(){
        const xyToggleValue=await page.$eval('.xytoggle', el=> el.value);
        assert.equal(xyToggleValue,"on");
    });
    it("should test toggle button: off", async function(){
        // await page.evaluate(function(){
        //     document.querySelector('.xytoggle').click();
        //     // xyToggleValue=document.getElementsByClassName('xytoggle').value;
        // });
        const xyToggle=await page.$('.toggle');
        await xyToggle.click();
        let xyToggleValue=await page.$eval('.xytoggle', el=> el.value);
        console.log(xyToggleValue);
    });
    

});