const assert = require('chai').assert;
const puppeteer = require('puppeteer');
const _ = require('lodash');
const globalVariables = _.pick(global, ['browser', 'expect']);
const opts = {
    headless: false,
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
        assert.equal(headingValue,"Simple Data Grapher");
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
        await fileInput.type("A,2,3\nB,5,6\nC,8,9");
        await page.mouse.click(10,10);
        const uploadButton=await page.$('.uploadButton');
        await uploadButton.click();
    });
    after (async function () {
        await page.close();
    });
    it("should test toggle button: on", async function(){
        let xyToggleValue=await page.$('.xytoggle');
        let val=await (await xyToggleValue.getProperty('checked')).jsonValue();
        assert.equal(val,true);
    });
    it("should test toggle button: off", async function(){
        const xyToggle=await page.$('.toggle');
        await xyToggle.click();
        let xyToggleValue=await page.$('.xytoggle');
        let val=await (await xyToggleValue.getProperty('checked')).jsonValue();
        assert.equal(val,false);
    });
    it("should select Y-Axis columns", async function(){
        const col1=await page.$('#first_y_axis_input_columns1');
        await col1.click();
        const col2=await page.$('#first_y_axis_input_columns2');
        await col2.click();
        const val1=await (await col1.getProperty('checked')).jsonValue();
        const val2=await (await col2.getProperty('checked')).jsonValue();
        assert.equal(val1&&val2,true);

    });
    it("should select X-Axis column", async function(){
        const xyToggle=await page.$('.toggle');
        await xyToggle.click();
        const col1=await page.$('#first_x_axis_input_columns0');
        await col1.click();
        const val1=await (await col1.getProperty('checked')).jsonValue();
        assert.equal(val1,true);
    });
    it("should check plotting the graph", async function(){
        const plot_graphButton=await page.$(".plotGraph");
        await plot_graphButton.click();
        assert.notEqual(plot_graphButton,undefined);
    });
    it("should check if graph exists", async function(){
        const graph_container=await page.$("#first_chart_container_0");
        assert.notEqual(graph_container,undefined);
    });
    

});
