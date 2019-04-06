const Cylon = require('cylon');

class CylonConfig {
    constructor(name = 'led' , pin = 11){
        this.firstTime = true;
        this.name = name;
        this.pin = pin;
        this.cylon = Cylon;
        this.robot = this.cylon.robot;
        this.connections = this.getConections();
        this.devices = this.getDevices();
        this.options = {
            connections: this.connections,
            devices: this.devices,
            work: this.work.bind(this)
        }
        return this;
    }
    
    init(){
        this.config();
        this.setEvents();
        this.robot.start();
        this.luz = this.robot['luz'];
           
        return this;
    }

    config(){
        this.robot = this.robot(this.options);
    }

    work(my){
        console.log('Entra por work');
        // console.log('antes antes', my.luz.isOn());

        // after((5).seconds(), function () {
        //     console.log('antes',this.luz.isOn());
        //     this.luzOn()
        //     console.log('despues',this.luz.isOn());
        // }.bind(this))
        // console.log(my);
        // my['luz'].turnOn();
        // my.turnOn();
        
    }

    getConections(){
        return {
            raspi: {
                adaptor: 'raspi'
            }
        };
    }
    getDevices(){
        return {
            luz: {
                driver: this.name,
                pin: this.pin
            }
        }
    }

    luzOn(){
        if(this.luz) this.luz.turnOn();
    }

    luzOff(){
        if(this.luz) this.luz.turnOff();
    }

    luzToggle(){
        if(this.luz) this.luz.toggle()
    }

    luzIsOn(){
        if(this.luz) return this.luz.isOn();
        else return false;
    }

    /*******Events ******/

    setEvents(){
        this.robot.on('ready' , this.onReady.bind(this));
        this.robot.on('halt', this.onHalt.bind(this));
        this.robot.on('error' , this.onError.bind(this));
    }
    
    onReady(bot){
        console.log('Cylon Onready');
        // // this.robot['luz'].turnOn()
        // console.log(this.robot['luz'].details)
        // // bot['luz'].turnOn()
        
    }

    onError(error){
        console.error('Cylon ERROR' ,error);
    }
    
    onHalt(e){
        console.log('Cylon se está cerrando',e);
        
    }

}





module.exports = CylonConfig;


// {
//     connections: {
//         raspi: {
//             adaptor: 'raspi'
//         }
//     },

//     devices: {
//         luz: {
//             driver: 'led',
//                 pin: 11
//         }
//     },
//     work: function (my) {
//         toogleDevice(my, device);
//     }.bind(this)
// }