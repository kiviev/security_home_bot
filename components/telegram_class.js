const TelegramBot = require('node-telegram-bot-api');
const Helpers = require('../helpers');
const RPiLeds = require('../mods/leds/RPiLeds');
const SystemStats = require('../mods/system/System');


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
		}
		
	}
	
	initBot(){
		if(!this.init) return false;
		this.modsAvaliables = this.getModsAvaliables();
		this.cretateListeners();
		this.onCallbackQuery();
		// this.listenMessage();
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
		this.onText(/^\/ping/ , this.cbPong.bind(this));
		this.onText(/^\/houron(.+)/ , this.cbLedHourOn.bind(this));
		this.onText(/^\/houroff(.+)/ , this.cbLedHourOff.bind(this));
		this.onText(/^\/hourbooth(.+)/ , this.cbLedHourBooth.bind(this));
		this.onText(/^\/hourclear(.+)/ , this.cbLedHourClear.bind(this));
		this.onText(/^\/servermonitor/ , this.cbServerMonitor.bind(this));

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

	cbLed(msg,match){
		let chatId = msg.chat.id;
		let buttons = {			
				inline_keyboard: [
					[
						{
							text: 'Led Status',
							callback_data: 'ledGetStatus'
						},

					],
					[
						{
							text: 'Manual On',
							callback_data: 'ledManualOn'
						},
						{
							text: 'Manual Off',
							callback_data: 'ledManualOff'
						},
					],
					[
						{
							text: 'Hora de encendido',
							callback_data: 'ledGetHourOn'
						},
						{
							text: 'Hora de apagado',
							callback_data: 'ledGetHourOff'
						}
					],
					[
						{
							text: 'Iniciar Horas programadas',
							callback_data: 'ledInitSchedule'
						},

					],
				]
			};
		this.leds = RPiLeds;
		this.sendMessage(chatId , "Se ha inicializado el módulo led...",buttons);
	}

	async cbPong(msg,match){
		console.log('pasa por pong');
		
		let isAdmin = await this.cbAdminMembers(msg);
		if (!isAdmin) return false;
		this.sendMessage(msg.chat.id , "Pong");


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
			
			if (checkHour && hon !== resp){
				this.leds.setHourOn(resp);
				msgResp = "Se ha establecido la hora de inicio a las *" + this.leds.getHourOn(true) + "*";
			}else err = true;
		} else {
			err = true;
			msgResp += "*Motivo*: No se ha iniciado el módulo *Led*."
		} 
		if(err) {
			msgResp += checkHour === null ? '*Motivo*: formato de hora incorrecta \"*' + resp + '*\"' : '';
		}
		this.sendMessage(chatId,msgResp);
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
		
		this.sendMessage(chatId , msgResp);
	}

	cbLedHourClear(msg, match) {
		let chatId = msg.chat.id;
		let resp = match[1];
		let msgResp = 'No se ha podido limpiar las horas.\n';
		if (this.leds) {
			this.leds.clearHours();
			msgResp = "Se han limpiado las horas";
		}
		this.sendMessage(chatId,msgResp);
	}
	
	cbLedHourBooth(msg,match){
		let chatId = msg.chat.id;
		let resp = match[1].trim();
		let msgResp = 'No se ha podido setear ambas horas.\n';
		if (this.leds /* && !(this.leds.hourOn && this.leds.hourOff) */) {
			let horas = resp.split(' ');
			console.log('horassssssss;' , horas);
			if(horas.length && horas.length == 2){
				let compare = Helpers.compareTime(horas[1], horas[0]);
				if(compare == 1){
					this.leds.setHourOn(horas[0]);
					this.leds.setHourOff(horas[1]);
					// this.leds.ledInitSchedule();
					msgResp = `Se han establecido las horas correctamente \n-Encendido: *${this.leds.getHourOn(true)}* \n-Apagado: *${this.leds.getHourOff(true)}*`;
				}else{
					msgResp += "Las horas no son correctas."
				}
			}
		}
		this.sendMessage(chatId, msgResp);
	}

	async cbServerMonitor(msg,match){
		console.log('entra por servermonitor');
		let isAdmin = await this.cbAdminMembers(msg);
		if(!isAdmin) return false;

		let chatId = msg.chat.id;
		let resp = SystemStats();
		
		if(resp){
			this.sendMessage(chatId,resp);
		}
		
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

	cbEcho(msg, match) {
	  let chatId = msg.chat.id;
		let resp = match[1]; // the captured "whatever"
		console.log('chad id:' ,chatId);
		
	  this.sendMessage(chatId, 'jurjur repito todo lo que dices \r\n' + resp);
	}

	// To Do mover esto a una nueva clase que gestione todo lo que tenga que ver con el modulo
	cbMotionCamera(msg, match) {
		console.log('entra en motioncamera');
		let chatId = msg.chat.id;

		let buttons = {
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
					};

		this.sendMessage(chatId, 'Esto lanza el motionCamera \r\n' ,buttons);
	}

	onCallbackQuery(){
		this.bot.on('callback_query', (callbackQuery,d) => {
			// console.log(callbackQuery);
			console.log(d);
			
			let action = callbackQuery.data;
			let msg = callbackQuery.message;
			let chatId = msg.chat.id;
			let opts = {
				chat_id: chatId,
				message_id: msg.message_id,
			};
			let text = 'ssd';
			let response = null;
			if (action.startsWith('led')){
				 response = this.handleLedActionButton(action,chatId);
			}
			// this.bot.editMessageText(text, opts);
			if(response){
				this.sendMessage(chatId, response);
			}
		});
	}

	handleLedActionButton(action,chatId){
		switch (action) {
			case 'ledGetStatus':
				console.log('pasa por ledGetStatus');
				console.log(this.leds.getStatusText());
				return this.leds.getStatusText();
				break;
			case 'ledManualOn':
				this.leds.setManual(true);
				console.log('pasa por ledmanualon');
				this.sendMessage(chatId,'Se ha encendido manualmente la luz-')
				break;
				case 'ledManualOff':
				console.log('pasa por ledManualOff');
				this.leds.setManual(false);
				this.sendMessage(chatId,'Se ha apagado manualmente la luz-')

				break;
			case 'ledGetHourOn':
				console.log('pasa por ledGetHourOn');
				if(this.leds){
					this.bot.sendMessage(chatId , this.leds.getHourOn(true) );
				}
				break;
			case 'ledGetHourOff':
			if (this.leds) {
				this.bot.sendMessage(chatId, this.leds.getHourOff(true));
			}
			break;
			case 'ledInitSchedule':
				console.log('pasa por ledInitSchedule');
				this.leds.ledInitSchedule()
				break;
			default:
				break;
		}
	}

	getModsAvaliables(){
		let constantName = 'AVAILABLE_MODS_BOT_' + this.botname.toUpperCase();
		let modsToBot = process.env[constantName];
		if(!modsToBot) return false;
		return Helpers.envToArray(constantName);
	}

	setMessages(){
		this.messages = {
			leds : {

			}
		}
	}
}



module.exports =TelegramService;