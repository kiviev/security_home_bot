const TelegramBot = require('node-telegram-bot-api');
const Helpers = require('../helpers');




class TelegramService {

	constructor(botname = '') {
		if (process.env['TG_TOKEN_BOT_' + botname.toUpperCase()]) {
			this.bot = new TelegramBot(process.env['TG_TOKEN_BOT_' + botname.toUpperCase()], {
				polling: true
			});
			if(this.bot) this.init = true;
			else return false;
			this.botname = botname;
			this.leds = null;
			this.modules = [];
		}

	}

	initBot(){
		if(!this.init) return false;
		this.pollingError();
		this.chargeModules();
		this.cretateListeners();
		this.onCallbackQuery();
		// this.listenMessage();
	}
	pollingError(){
		this.bot.on('polling_error', (error) => {
			console.error(error);
		});
	}

	cretateListeners(){
		return false;
	}

	chargeModules(){
		this.modsEnabled = this.getModsEnabled();
		if (!this.modsEnabled || !Array.isArray(this.modsEnabled) || !this.modsEnabled.length) return false;
		for(let i in this.modsEnabled){
			this.chargeModule(this.modsEnabled[i]);
		}
	}

	chargeModule(name){
		if( typeof name !== 'string' && name == '' ) return false;
		try {
			let Mod = require('../mods/' + name + '/' + name + 'Mod');
			if (Mod) {
				this.modules[name] = new Mod(this.bot);
				if (this.modules[name]){
					this.modules[name].init();
				}
			}
		} catch (error) {
			console.error('No ha sido posible  cargar el modulo ' + name);
			console.error(error);
		}
	}

	sendMessage(chatId,resp,buttons,parse_mode = "Markdown"){
		this.bot.sendMessage(chatId, resp,
			{
				reply_markup: buttons,
				parse_mode : parse_mode
			});
	}

	listenMessage(){
		this.bot.on('message', (msg) => {
			const chatId = msg.chat.id;
			// send a message to the chat acknowledging receipt of their message
			this.sendMessage(chatId, 'Se ha recivido su mensaje');
		});
	}

	onText(regex,cb){
		this.bot.onText(regex ,cb);
	}

	async cbAdminMembers(msg){
		return await this.bot.getChatMember(msg.chat.id, msg.from.id).then((data) => {

			if ((data.status == "creator") || (data.status == "administrator")) {
				return true;
			} else {
				this.bot.sendMessage(msg.chat.id, "No eres admin, no puedes usar esta funcionalidad");
				return false;
			}
		});
	}


	onCallbackQuery(){
		this.bot.on('callback_query', (callbackQuery) => {
			let action = callbackQuery.data;
			let msg = callbackQuery.message;
			let chatId = msg.chat.id;
			let modName = action.split('_');
			this.modules[modName[0]].handleActionButton(action, chatId);
		});
	}

	getModsEnabled(){
		let constantName = 'AVAILABLE_MODS_BOT_' + this.botname.toUpperCase();
		let modsToBot = process.env[constantName];
		if(!modsToBot) return false;
		return Helpers.envToArray(constantName);
	}

}



module.exports = TelegramService;