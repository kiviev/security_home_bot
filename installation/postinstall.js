const isPi = require('detect-rpi');
const npmi = require('npmi');
const path = require('path');
/**
 * Dependencias necesarias para el modulo led (solo funcionan en RPi)
 *  "cylon": "1.3.0",
    "cylon-gpio": "0.30.1",
    "cylon-i2c": "0.26.1",
    "cylon-raspi": "0.20.1",
 */

const packagesRPI = [ // array
    {
        name: 'cylon',	// your module name
        version: '1.3.0',		// expected version [default: 'latest']
        path: '.',				// installation path [default: '.']
        forceInstall: true,	// force install if set to true (even if already installed, it will do a reinstall) [default: false]
        npmLoad: {				// npm.load(options, callback): this is the "options" given to npm.load()
            loglevel: 'silent',	// [default: {loglevel: 'silent'}]
            save: 'false'
        },
    },
    {
        name: 'cylon-gpio',
        version: '0.30.1',
        path: '.',
        forceInstall: true,
        npmLoad: {
            loglevel: 'silent',
            save : false
        },
    },
    {
        name: 'cylon-i2c',
        version: '0.26.1',
        path: '.',
        forceInstall: true,
        npmLoad: {
            loglevel: 'silent',
            save : false
        }
    },
    {
        name: 'cylon-raspi',
        version: '0.20.1',
        path: '.',
        forceInstall: true,
        npmLoad: {
            loglevel: 'silent',
            save: false
        }
    }
];



if(isPi()){
    installPackages(packagesRPI);
}else{
    console.error("Hay paquetes que no se pueden instalar. No es una Raspberry Pi.");
}

function installPackages(packages) {
    if(!Array.isArray(packages)) return false;
    for(i in packages){
        installPackage(packages[i]);
    }
}


function installPackage(options) {
    npmi(options, function (err, result) {
        if (err) {
            if (err.code === npmi.LOAD_ERR) console.log('npm load error');
            else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
            return console.log(err.message);
        }
        // installed
        console.log(options.name + '@' + options.version + ' installed successfully in ' + path.resolve(options.path));
    });
}