


class Module {
    constructor(bot,name){
        this._name = name;
        this._bot = bot;
        this.getButtons();
    }
    init(){
        this.cretateListeners();
    }

    get name(){
        return this._name;
    }

    get bot(){
        return this._bot;
    }

    set bot(bot){
        this._bot = bot;
    }

    getButtons(){
        return {};
    }

    cretateListeners(){
        return false;
    }

     _onText(regex,cb){
        this._bot.onText(regex, cb);
    }

    _sendMessage(chatId, resp, buttons = false, parse_mode = "Markdown") {
        let options = {
            parse_mode : parse_mode
        };
        if(buttons){
            if(typeof buttons == 'object') options.reply_markup = buttons;
            else options.reply_markup = this.getButtons();
        }
        this._bot.sendMessage(chatId, resp, options)
            .catch((error) => {
                console.log(error.code);  // => 'ETELEGRAM'
                console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
            });
    }

    async _isAdmin(msg) {
        let data = await this._bot.getChatMember(msg.chat.id, msg.from.id).catch(error => {
            console.error("Error getChatAdministrators, ", error.response.body);
        })
        if (data && ((data.status == "creator") || (data.status == "administrator"))){
            return true;
        }
        this._sendMessage(msg.chat.id, "No eres admin, no puedes usar esta funcionalidad");
        return false;
    }

    async _getChatAdministrators(msg) {
       return await this._bot.getChatAdministrators(msg.chat.id).catch(error => {
            console.error("Error getChatAdministrators, ", error.response.body);
        });
    }

    handleActionButton(action, chatId){
        return false;
    }


}


module.exports = Module;