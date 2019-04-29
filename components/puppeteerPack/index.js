require('dotenv').config({ path: '../../.env' });
const Pupp = require('./PuppeteerPack');



(async() =>{
    let p = new Pupp(process.env.ABONO_URL);
    // console.log(p);
    await p.init();
    // console.log(p);

    let result = await p.getResults();
    console.log(result);

    await p.close();

})()