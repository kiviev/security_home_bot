var osutils = require("os-utils");

 function getStats(){
    let str = '*Monitorización del servidor*\n';
    osutils.cpuUsage(async (v) => {
        str += ("- CPU Usage (%) : " + (v * 100).toFixed(2) + "\n");
    });
    str += "- Platform: " + osutils.platform() + "\n";
    str += ("- Number of CPUs: " + osutils.cpuCount() + "\n");


    str += ("- Load Average (5m): " + (osutils.loadavg(5) * 100).toFixed(2) + "%\n");

    str += ("- Total Memory: " + (osutils.totalmem()/1024).toFixed(2) + "GB" + "\n");

    str += ("- Free Memory: " + (osutils.freemem()/1024).toFixed(2) + "GB" + "\n");

    str += ("- Free Memory: " + ((osutils.freememPercentage() * 100).toFixed(2))+ "%\n");

    str += ("- System Uptime: " + (osutils.sysUptime()/60/60).toFixed(2) + "h" + "\n");
    return str;
}

module.exports = getStats