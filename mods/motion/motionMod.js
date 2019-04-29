const Module = require('../Module');

class MotionModule extends Module {

    constructor(bot) {
        super(bot, 'motion');
    }

    getButtons() {
        return {
            inline_keyboard: [
                [
                    {
                        text: 'Encender Sistema',
                        callback_data: 'motion_SystemOn'
                    },
                    {
                        text: 'Apagar Sistema',
                        callback_data: 'motion_SystemOff'
                    },
                ],
                [
                    {
                        text: 'Cámara1 Captura',
                        callback_data: 'motion_Camera1Capture'
                    },
                    {
                        text: 'Cámara2 Captura',
                        callback_data: 'motion_Camera2Capture'
                    }
                ]
            ]
        };
    }

    cretateListeners() {
        let regex = new RegExp("/" + this._name + "(.+)?");
        this._onText(regex, this.cbMotionCamera.bind(this));
    }

    cbMotionCamera(msg, match) {
        console.log('entra en motioncamera');
        let chatId = msg.chat.id;
        let buttons = this.getButtons();
        this._sendMessage(chatId, 'Esto lanza el motionCamera \r\n', buttons);
    }

    motion_SystemOn(chatId) {
        console.log('motion_SystemOn');
        this._sendMessage( chatId,'Estoy encendiendo...');
    }

    motion_SystemOff(chatId) {
        console.log('motion_SystemOff');
    }

    motion_Camera1Capture(chatId) {
        console.log('motion_Camera1Capture');
    }

    motion_Camera2Capture(chatId) {
        console.log('motion_Camera2Capture');
    }

    handleActionButton(action, chatId){
        switch (action) {
            case 'motion_SystemOn':
                this.motion_SystemOn(chatId);
                break;
            case 'motion_SystemOff':
                this.motion_SystemOff(chatId);
                break;
            case 'motion_Camera1Capture':
                this.motion_Camera1Capture(chatId);
                break;
            case 'motion_Camera2Capture':
                this.motion_Camera2Capture(chatId);
                break;

            default:
                break;
        }
    }
}

module.exports = MotionModule;