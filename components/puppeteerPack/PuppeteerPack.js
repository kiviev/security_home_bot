require('dotenv').config({ path: '.env' });
const puppeteer = require('puppeteer');
const Helpers = require('../../helpers');



class PuppeteerPack {
    constructor(url,params = {}){
        this.pup = puppeteer;
        this.browser = null;
        this.page = null;
        this.url = url || null;
        this.headless  = process.env.IN_DEVELOPMENT;
        this.select = process.env.ABONO_SELECT_ID;
        this.input = process.env.ABONO_INPUT_ID;
        this.sendButton = process.env.ABONO_SEND_BUTTON_ID;
        this.resultTable = process.env.ABONO_RESULT_TABLE;
        this.numAbono = Helpers.getAbonoNum(process.env.ABONO_NUM);
        return this;
    }


    async init(){
        await this.launch();
        await this.getPage();
        await this.setLogs();
        await this.goToUrl();
        await this.inPage();
    }

    async run(){

    }

    async launch(){
        console.log('xxxxxxx' ,this.headless);
        
        this.browser = await this.pup.launch({
            headless: false,
            // devtools : false,
            ignoreHTTPSErrors: true,
        });
    }
    async getPage(){
        if(this.browser){
            this.page = await this.browser.newPage();
            await this.page.setViewport({ width: 1350, height: 768 });
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        }else return false;
    }

    async goToUrl(){
        if(this.page && this.url){            
            await this.page.goto(this.url);
        }else return false;
    }
    async setLogs(){
        if(!this.page) return false;
        this.page.on('console', consoleObj => console.log(consoleObj.text()));            

    }

    async close(){
        if(this.browser){
            await this.page.waitFor(1000);
            await this.browser.close();
        }else return false;
    }

    async inPage(){
        if(!this.page || !this.numAbono) return false;
        await this.page.select(this.select,this.numAbono.select);
        await this.page.waitFor(1000);
        await this.page.focus(this.input);
        await this.page.waitFor(3000);
        await this.page.keyboard.type(this.numAbono.input);
        await this.page.click(this.sendButton);
        await this.page.waitForNavigation({ waitUntil: 'load' })

    }

    async evaluate(){
        if (!this.page) return false;
        let result = await this.page.evaluate(selector => {
            let data = $(selector);
            let dataFinal = {};
            for(let i in data){
                dataFinal[i] = data[i].innerHTML;
            }           
            return dataFinal;
            
        }, this.resultTable);
        
        let finalData = Helpers.getAbonoResultData(result)
        return finalData;
    }

    async getResults(){
        return this.evaluate();
    }
}



module.exports = PuppeteerPack

// async function run() {
//     const browser = await puppeteer.launch({
//         headless: process.env.IN_DEVELOPMENT,
//         ignoreHTTPSErrors: true
//     });
//     const page = await browser.newPage();
//     const url = process.env.ABONO_URL;
//     console.log(url);
//     if (!url) browser.close();
    
//     await page.goto(url);
//     await page.screenshot({ path: __dirname + '/screenshots/abono.png' });

//     browser.close();
// }

// run();