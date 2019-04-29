const Module = require('../Module');
const SystemStats = require('../system/System');


class MonitorModule extends Module {

    constructor(bot) {
        super(bot, 'monitor');
    }

    cretateListeners() {
        let regex = new RegExp("/" + this._name + "(.+)?");
        this._onText(regex, this.cbMonitor.bind(this));

    }

    async cbMonitor(msg, match) {
        let isAdmin = await this._isAdmin(msg);
        if (!isAdmin) return false;

        let chatId = msg.chat.id;
        let resp = SystemStats();

        if (resp) {
            this._sendMessage(chatId, resp);
        }

    }
}

module.exports = MonitorModule;