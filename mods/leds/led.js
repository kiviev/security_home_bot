const Cylon = require('cylon');
const fb = require('./firebase');


function toogleDevice(my, device) {
    //    status ? my[device].turnOn() : my[device].turnOff();
    setInterval(async () => {
        let onoff = await getStatus(device);
        onoff ? my[device].turnOn() : my[device].turnOff();
        console.log('[' + new Date() + '] -> device:', device, 'on:', onoff);
    }, process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 10000);
}



async function getStatus(device) {
    let dbdata = await fb.getStatusLedFirebase(device);
    let onoff = false;
    if (dbdata && dbdata.status !== null) {
        if (dbdata.on && dbdata.off) {
            let date = new Date();
            let hour = date.getHours();
            let min = date.getMinutes();
            let nowString = hour + ':' + min;
            let compareOn = compareTime(nowString, dbdata.on);
            let compareOff = compareTime(dbdata.off, nowString);
            console.log('on', compareOn, dbdata.on);
            console.log('off', compareOff, dbdata.off);
            let statusWithTime = false;
            if (compareOn >= 0 && compareOff > 0) statusWithTime = true
            else statusWithTime = false;
            onoff = statusWithTime;
        } else {
            onoff = dbdata.status;

        }
    }
    return onoff;
    process.exit();

}

function compareTime(str1, str2) {
    if (str1 === str2) {
        return 0;
    }
    var time1 = str1.split(':');
    var time2 = str2.split(':');
    if (eval(time1[0]) > eval(time2[0])) {
        return 1;
    } else if (eval(time1[0]) == eval(time2[0]) && eval(time1[1]) > eval(time2[1])) {
        return 1;
    } else {
        return -1;
    }
}




module.exports = function (device) {

    Cylon.robot({
        connections: {
            raspi: {
                adaptor: 'raspi'
            }
        },

        devices: {
            luz: {
                driver: 'led',
                pin: 11
            }
        },
        work: function (my) {
            toogleDevice(my, device);
        }.bind(this)
    }).start();
};