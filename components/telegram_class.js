const TelegramBot = require('node-telegram-bot-api');

class TelegramService {

    constructor(url) {
    	this.bot = new TelegramBot(process.env.TG_TOKEN, {
    		polling: true
    	});;
    
	}
	
	init(){
		this.cretateListeners();
		// this.listenMessage()
	}

	cretateListeners(){
		this.onText(/\/echo (.+)/, this.cbEcho.bind(this));
	}
	
	sendMessage(chatId,resp){
		this.bot.sendMessage(chatId, resp);
	}

	listenMessage(){
		this.bot.on('message', (msg) => {
			const chatId = msg.chat.id;
			console.log('holita' , msg)
			// send a message to the chat acknowledging receipt of their message
			this.sendMessage(chatId, 'Se ha recivido su mensaje');
		});
	}

	onText(regex,cb){
		this.bot.onText(regex ,cb);
	}

	cbEcho(msg,match){
		const chatId = msg.chat.id;
		const resp = match[1]; // the captured "whatever"
		this.sendMessage(chatId, 'jurjur ' + resp);
	}

}



module.exports =TelegramService;