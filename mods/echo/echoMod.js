const Module = require('../Module');

class EchoModule extends Module{

    constructor(bot){
        super(bot,'echo');
    }

    getButtons(){
        return {
            inline_keyboard: [
                [
                    {
                        text: 'Test echo buttons',
                        callback_data: 'testEcho'
                    },

                ],
            ]
        }
    }

    cretateListeners(){
        let regex = new RegExp("/" + this._name + "(.+)?");
        this._onText(regex, this.cbEcho.bind(this));
    }

    cbEcho(msg, match) {
        let chatId = msg.chat.id;
        let resp = match[1]; // the captured "whatever"
        console.log('chad id:', chatId);        
        this._sendMessage(chatId, 'jurjur repito todo lo que dices\n' + resp);
    }
}

module.exports = EchoModule; 