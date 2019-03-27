require('dotenv').config();
Helpers = require('./helpers');

const Tg = require(__dirname + '/components/telegram_class');


const telegramBot1 = new Tg('home_security');
telegramBot1.initBot();
