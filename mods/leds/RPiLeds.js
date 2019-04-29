const Helpers = require('../../helpers');
const Cylon = require('./Cylon');


class RPiLeds {
    constructor(){
        if (!RPiLeds.instance){
            this.pin = process.env.MOD_LED_PINNUM ;
            this.on = false; // false = off , true = on
            this.hourOn = null;
            this.HourOff = null;
            this.manual = false;
            this.schedule = false;

            this.cylon = new Cylon().init();

            // this.luz = this.cylon.luz;

            RPiLeds.instance = this;

        }
        return RPiLeds.instance;
    }

    init(){
        if(this.manual){
            //TODO Encender manual
        }else{
            // TODO Apager manual
        }
        if(this.hourOn && this.hourOff){
            // TODO encendier si hour on es menor que hour off y si la hora de verdad esta entre las dos
        }else {
            // TODO Apagar o delegarlo a manual si no se han establecido horas
        }
    }

    ledInitSchedule(){
        console.log('pasa por Rpileds ledInitSchedule', this.hourOn, this.hourOff);

        if (this.hourOn && this.hourOff) {
            console.log('pasa por Rpileds ledInitSchedule 1, this.checkHour', this.checkHours());
            if(this.checkHours() == 1){
                console.log('pasa por Rpileds ledInitSchedule 2');
                this.intervalSchedule = setInterval(() => {
                    console.log('pasa por Rpileds ledInitSchedule interval');

                    let active = this.ledScheduleIsActive();
                    console.log('pasa por Rpileds ledInitSchedule interval active: ' , active);
                    if (active && !this.schedule){
                        this.schedule = true;
                        this.cylon.luzOn();
                    } else {
                        if(!active){
                            this.schedule = false;
                            this.cylon.luzOff();
                            // clearInterval(this.intervalSchedule);
                        }
                    }
                }, 1000);
            }

            // TODO encendier si hour on es menor que hour off y si la hora de verdad esta entre las dos
        } else {
            // this.manual = false;
            // TODO Apagar o delegarlo a manual si no se han establecido horas
        }
        return false;
    }

    checkHours(){
        return Helpers.compareTime(this.hourOff,this.hourOn);
    }

    ledScheduleIsActive(){
        let date = new Date();
        let hour = date.getHours();
        let min = date.getMinutes();
        let nowString = hour + ':' + min;
        let compareOn = Helpers.compareTime(nowString, this.getHourOn());
        let compareOff = Helpers.compareTime(this.getHourOff(), nowString);
        console.log('on', compareOn, this.getHourOn());
        console.log('off', compareOff, this.getHourOff());
        let statusWithTime = false;
        if (compareOn >= 0 && compareOff > 0) statusWithTime = true;
        else statusWithTime = false;
        return statusWithTime;
    }

    setManual(status){
        this.luzManual(status)
        this.on = this.luzStatus();
        this.manual = status;
    }

    togleStatus(){
        this.on = !this.on;
    }

    luzManual(on){
        if(this.cylon.luz){
            let status = this.luzStatus();
            if(on){
                if(!status) this.cylon.luzOn();
            }else{
                if(status) this.cylon.luzOff();
                clearInterval(this.intervalSchedule);
            }
            // on ? this.cylon.luzOn() : this.cylon.luzOff();
        }
    }

    luzStatus(){
        if(this.cylon.luz) return this.cylon.luzIsOn();
        else return false;
    }

    setHourOn(str) {
        if (Helpers.checkFormatHour(str)) this.hourOn = str;
    }

    getHourOn(inText) {
        if(inText){
            if(!this.hourOn) return "Sin hora Establecida"
        }
        return this.hourOn;
    }

    getHourOff(inText) {
        if (inText) {
            if (!this.hourOn) return "Sin hora Establecida"
        }
        return this.hourOff;
    }

    setHourOff(str){
        if(Helpers.checkFormatHour(str)) this.hourOff = str;
    }
    clearHours(){
        this.hourOn = null;
        this.hourOff = null;
    }

    setOn(){
        this.status = true;
    }
    setOff(){
        this.status = false;
    }

    getStatusText(){
        return this.__toString();
    }
    __toString(){
        // console.log(this.cylon);

        return ` *Estado del led*
- Encendido Manual: ${this.manual ? "*Encendido*" : "Apagado"}
- Hora de encendido:   ${this.getHourOn(true)}
- Hora de apagado: ${this.getHourOff(true)}
- En este momento está: ${this.on ? "*Encendido*" : "Apagado"}`; 
    }
}


const instance = new RPiLeds();
module.exports = instance;