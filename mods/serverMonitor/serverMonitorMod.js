const Module = require('../Module');
const SystemStats = require('../system/System');


class serverMonitorModule extends Module {

    constructor(bot) {
        super(bot, 'servermonitor');
    }

    cretateListeners() {
        let regex = new RegExp("/" + this._name + "(.+)?");
        this._onText(regex, this.cbServerMonitor.bind(this));
        
    }

    async cbServerMonitor(msg, match) {
        let isAdmin = await this._isAdmin(msg);
        if (!isAdmin) return false;

        let chatId = msg.chat.id;
        let resp = SystemStats();

        if (resp) {
            this._sendMessage(chatId, resp);
        }

    }
}

module.exports = serverMonitorModule; 