const Helpers = require('../../helpers');


    
class RPiLeds {
    constructor(){
        if (!RPiLeds.instance){
            this.pin = process.env.MOD_LED_PINNUM ;
            this.on = false; // false = off , true = on
            this.hourOn = null;
            this.HourOff = null;
            this.manual = false;
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

    setManual(status){
        this.manual = status;
        this.on = status;
    }

    togleStatus(){
        this.on = !this.on;
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
        return ` *Estado del led*
- Encendido Manual: ${this.manual ? "*Encendido*" : "Apagado"}
- Hora de encendido:   ${this.getHourOn(true)}
- Hora de apagado: ${this.getHourOff(true)}
- En este momento está: ${this.on ? "*Encendido*" : "Apagado"}`; 
    }
}


const instance = new RPiLeds();
module.exports = instance;