
const sendTG = require('./curl');


var type = process.argv[2] || null;
var filepath = process.argv[3] || null;
var msg = process.argv[4] || '';
console.log({type,filepath,msg});




async function sendVideo(path,msg) {
  let x = await sendTG.sendVideo(path,msg);
//   console.log('resultado', x);
}



switch (type) {
    case 'video':
        sendVideo(filepath,msg)
        break;
  case 'msg':
        sendTG.sendText(process.argv[3])
        break;

  case 'image':
        sendTG.sendImage(filepath,msg)
        break;

    default:
        break;
}