const Module = require('../Module');
const RPiLeds = require('./RPiLeds');

class LedsModule extends Module {

    constructor(bot) {
        super(bot, 'leds');
    }

    getButtons() {
        return {
            inline_keyboard: [
                [
                    {
                        text: 'Led Status',
                        callback_data: 'leds_GetStatus'
                    },

                ],
                [
                    {
                        text: 'Manual On',
                        callback_data: 'leds_ManualOn'
                    },
                    {
                        text: 'Manual Off',
                        callback_data: 'leds_ManualOff'
                    },
                ],
                [
                    {
                        text: 'Hora de encendido',
                        callback_data: 'leds_GetHourOn'
                    },
                    {
                        text: 'Hora de apagado',
                        callback_data: 'leds_GetHourOff'
                    }
                ],
                [
                    {
                        text: 'Iniciar Horas programadas',
                        callback_data: 'leds_InitSchedule'
                    },

                ],
            ]
        };
    }

    cretateListeners() {
        let regex = new RegExp("/" + this._name + "(.+)?");
        this._onText(regex, this.cbLeds.bind(this));
        this.onText(/^\/houron(.+)/, this.cbLedHourOn.bind(this));
        this.onText(/^\/houroff(.+)/, this.cbLedHourOff.bind(this));
        this.onText(/^\/hourbooth(.+)/, this.cbLedHourBooth.bind(this));
        this.onText(/^\/hourclear(.+)/, this.cbLedHourClear.bind(this));
    }

    cbLeds(msg, match) {
        let chatId = msg.chat.id;
        let buttons = this.getButtons();
        this.leds = RPiLeds;
        this._sendMessage(chatId, "Se ha inicializado el módulo led...", buttons);
    }

    async cbLedHourOn(msg, match) {
        let isAdmin = await this.cbAdminMembers(msg);
        if (!isAdmin) return false;
        let chatId = msg.chat.id;
        let resp = match[1].trim();
        let err = false;
        let msgResp = '*No* se ha podido establecer la hora de encendido.\n';
        let checkHour = false;
        if (this.leds) {
            let hon = this.leds.getHourOn();
            checkHour = Helpers.checkFormatHour(resp);

            if (checkHour && hon !== resp) {
                this.leds.setHourOn(resp);
                msgResp = "Se ha establecido la hora de inicio a las *" + this.leds.getHourOn(true) + "*";
            } else err = true;
        } else {
            err = true;
            msgResp += "*Motivo*: No se ha iniciado el módulo *Led*."
        }
        if (err) {
            msgResp += checkHour === null ? '*Motivo*: formato de hora incorrecta \"*' + resp + '*\"' : '';
        }
        this._sendMessage(chatId, msgResp);
    }

    async cbLedHourOff(msg, match) {
        let isAdmin = await this.cbAdminMembers(msg);
        if (!isAdmin) return false;
        let chatId = msg.chat.id;
        let resp = match[1].trim();
        let err = false;
        let checkHour = false;
        let msgResp = '*No* se ha podido establecer la hora de apagado.\n';
        if (this.leds) {
            let hoff = this.leds.getHourOff();
            checkHour = Helpers.checkFormatHour(resp);
            if (checkHour && hoff !== resp) {
                this.leds.setHourOff(resp);
                msgResp = "Se ha establecido la hora de apagado a las *" + this.leds.getHourOff(true) + "*";

            } else err = true;
        } else {
            err = true;
            msgResp += "*Motivo*: No se ha iniciado el módulo *Led*."
        }

        if (err) {
            msgResp += (checkHour === null ? '*Motivo*: formato de hora incorrecta \"*' + resp + '*\"' : '');
        }

        this._sendMessage(chatId, msgResp);
    }

    cbLedHourClear(msg, match) {
        let chatId = msg.chat.id;
        let resp = match[1];
        let msgResp = 'No se ha podido limpiar las horas.\n';
        if (this.leds) {
            this.leds.clearHours();
            msgResp = "Se han limpiado las horas";
        }
        this._sendMessage(chatId, msgResp);
    }

    cbLedHourBooth(msg, match) {
        let chatId = msg.chat.id;
        let resp = match[1].trim();
        let msgResp = 'No se ha podido setear ambas horas.\n';
        if (this.leds /* && !(this.leds.hourOn && this.leds.hourOff) */) {
            let horas = resp.split(' ');
            console.log('horassssssss;', horas);
            if (horas.length && horas.length == 2) {
                let compare = Helpers.compareTime(horas[1], horas[0]);
                if (compare == 1) {
                    this.leds.setHourOn(horas[0]);
                    this.leds.setHourOff(horas[1]);
                    // this.leds.ledInitSchedule();
                    msgResp = `Se han establecido las horas correctamente \n-Encendido: *${this.leds.getHourOn(true)}* \n-Apagado: *${this.leds.getHourOff(true)}*`;
                } else {
                    msgResp += "Las horas no son correctas."
                }
            }
        }
        this._sendMessage(chatId, msgResp);
    }


    handleActionButton(action, chatId) {
        switch (action) {
            case 'leds_GetStatus':
                console.log('pasa por leds_GetStatus');
                console.log(this.leds.getStatusText());
                return this.leds.getStatusText();
                break;
            case 'leds_ManualOn':
                this.leds.setManual(true);
                console.log('pasa por leds_manualon');
                this.sendMessage(chatId, 'Se ha encendido manualmente la luz-')
                break;
            case 'leds_ManualOff':
                console.log('pasa por leds_ManualOff');
                this.leds.setManual(false);
                this.sendMessage(chatId, 'Se ha apagado manualmente la luz-')

                break;
            case 'leds_GetHourOn':
                console.log('pasa por leds_GetHourOn');
                if (this.leds) {
                    this.bot.sendMessage(chatId, this.leds.getHourOn(true));
                }
                break;
            case 'leds_GetHourOff':
                if (this.leds) {
                    this.bot.sendMessage(chatId, this.leds.getHourOff(true));
                }
                break;
            case 'leds_InitSchedule':
                console.log('pasa por leds_InitSchedule');
                this.leds.ledInitSchedule()
                break;
            default:
                break;
        }
    }

}

module.exports = LedsModule; 