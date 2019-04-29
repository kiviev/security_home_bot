const Module = require('../Module');

class PingModule extends Module {

    constructor(bot) {
        super(bot, 'ping');
    }

    cretateListeners() {
        let regex = new RegExp("/" + this._name + "(.+)?");
        this._onText(regex, this.cbPong.bind(this));
    }

    async cbPong(msg, match) {
        console.log('pasa por pong');
        let isAdmin = await this._isAdmin(msg);
        if (!isAdmin) return false;
        this._sendMessage(msg.chat.id, "Pong");
    }
}

module.exports = PingModule;