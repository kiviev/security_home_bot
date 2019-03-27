const TelegramBot = require('node-telegram-bot-api');
const Helpers = require('../helpers')


class TelegramService {

    constructor(botname = '') {
		if (process.env['TG_TOKEN_BOT_' + botname.toUpperCase()]) {
			this.bot = new TelegramBot(process.env['TG_TOKEN_BOT_' + botname.toUpperCase()], {
				polling: true
			});
			if(this.bot) this.init = true;
			else return false;
			this.botname = botname;
		}
		
	}
	
	initBot(){
		if(!this.init) return false;
		this.modsAvaliables = this.getModsAvaliables();
		this.cretateListeners();
		
		this.listenMessage()
	}

	cretateListeners(){
		if(!this.modsAvaliables || !Array.isArray(this.modsAvaliables)) return false;

		for(let i in this.modsAvaliables){
			let mod = this.modsAvaliables[i].trim();
			let regex = new RegExp("/" + mod + "(.+)?");
			let cbModCapitalize = 'cb' + Helpers.capitalize(this.modsAvaliables[i]);
			
			if (typeof this[cbModCapitalize] == 'function'){
				this.onText(regex, this[cbModCapitalize].bind(this));
			}
		}

	}
	
	sendMessage(chatId,resp,buttons){
		this.bot.sendMessage(chatId, resp,buttons);
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

	cbEcho(msg, match) {
	  const chatId = msg.chat.id;
	  const resp = match[1]; // the captured "whatever"
	  this.sendMessage(chatId, 'jurjur repito todo lo que dices \r\n' + resp);
	}

	// To Do mover esto a una nueva clase que gestione todo lo que tenga que ver con el modulo
	cbMotionCamera(msg, match) {
		console.log('entra en motioncamera');
		let chatId = msg.chat.id;

		let buttons = {
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: 'Encender Sistema',
									callback_data:  'boton1CbData'
								}, 
								{
									text: 'Apagar Sistema',
									callback_data: 'music'
								},
							],
							[
								{
								  text: 'Cámara1 Captura',
								  callback_data: 'camera1Capture'
								},
								{
								  text: 'Cámara2 Captura',
								  callback_data: 'camera2Capture'
								}
							]
						]
					}
		};

		this.sendMessage(chatId, 'Esto lanza el motionCamera \r\n' ,buttons);
	}

	

	getModsAvaliables(){
		let constantName = 'AVAILABLE_MODS_BOT_' + this.botname.toUpperCase();
		let modsToBot = process.env[constantName];
		if(!modsToBot) return false;
		return Helpers.envToArray(constantName);
	}
}



module.exports =TelegramService;