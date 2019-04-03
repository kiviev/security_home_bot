const request = require('request');
const fs = require('fs-extra');
const dotEnv = require('dotenv').config({path:'../../.env'});
//  curl -s -X POST "https://api.telegram.org/bot767345950:AAHt66y5UwVIdGtdq8p4lIAQD8aQcLZtBnY/sendVideo" -F chat_id=148400127 -F video="@/home/pack/.motion/output/cam1/01-20190330144124.mp4" -F thumb="@/home/pack/.motion/output/cam1/CAM1_01-20190330144126-03.jpg" -F caption="Movimiento en casa"


let url = "https://api.telegram.org/bot" + process.env.TG_TOKEN_BOT_HOME_SECURITY + "/";

let action = "sendVideo";

// let formData = {
//   toUpload: {
//     value: fs.createReadStream('/home/pack/.motion/output/cam1/01-20190330144124.mp4'),
//     options: {
//       filename: "01-20190330144124.mp4",
//     //   contentType: fileToUpload.mimeType
//     }
//   }
// };



let method = 'POST';
// let form = {
//     chat_id: "148400127",
//     video: fs.createReadStream('/home/pack/.motion/output/cam1/01-20190330144124.mp4'),
//     thumb: fs.createReadStream('/home/pack/.motion/output/cam1/CAM1_01-20190330144126-03.jpg'),
//     caption : "Movimiento en casa desde js"
// }


// let xx = request.post({
//     headers: {
//       'content-type': 'multipart/form-data'
//     },
//     url : url + action,
//     formData: form,
//     json : true
// },(error,response,body)=>{
//     console.log("resultado de request error: " ,error);
//     // console.log("resultado de request response: " ,response);
//     // console.log("resultado de request body: " ,body);
    
// })


async function sendVideo(video_path, caption = '', thumb_path = '', chatid = "148400127") {
    let formData = {
        chat_id: chatid,
        duration : 10
      }
    if (typeof video_path == 'string' && video_path !== '') {
      let video = fs.createReadStream(video_path);
      formData.video = video;
    }
    if (typeof thumb_path == 'string' && thumb_path !== '') {
      let thumb = fs.createReadStream(thumb_path);
      formData.thumb = thumb;
    }
    if (caption) {
      formData.caption = caption;
    }

    let options = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      url: url + "sendVideo",
      formData: formData,
      json: true
    }

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) reject(error);
            else resolve(body);
        })

    }).catch(error => console.error('Ha habido un ERROR: ' , error));
}


async function sendImage(image_path, caption = '', chatid = "148400127") {
console.log(image_path);

    let formData = {
      chat_id: chatid
    }
    if (typeof image_path == 'string' && image_path !== '') {
      let image = fs.createReadStream(image_path);
      formData.photo = image;
    }
    if (caption) {
      formData.caption = caption;
    }

    let options = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      url: url + "sendPhoto",
      formData: formData,
      json: true
    }

    return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
    })

    }).catch(error => console.error('Ha habido un ERROR: ', error));
}

async function sendText(text, chatid = "148400127") {
  
        let formData = {
          chat_id: chatid
        }
       
        if (text) {
          formData.text = text;
        }

        let options = {
          headers: {
            'content-type': 'multipart/form-data'
          },
          url: url + "sendMessage",
          formData: formData,
          json: true
        }

        return new Promise((resolve, reject) => {
          request.post(options, (error, response, body) => {
            if (error) reject(error);
            else resolve(body);
          })

        }).catch(error => console.error('Ha habido un ERROR: ', error));
}
function getOptions(type){
    let part = '';
    switch (type) {
        case 'video':
            part = 'sendVideo';
            break;
        case 'image':
            part = 'sendPhoto';
            break;
        case 'msg':
            part = 'sendMessage';
            break;
    
        default:
            break;
    }
    if(part){
        return {
            headers: {
            'content-type': 'multipart/form-data'
            },
            url: url + part,
            json: true
        }

    }
}
async function send(type,options){
    
    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
        })

    }).catch(error => console.error('Ha habido un ERROR: ', error));
}

module.exports = {
    sendVideo ,
    sendImage ,
    sendText,
}


// console.log('holita' , xx.result);



