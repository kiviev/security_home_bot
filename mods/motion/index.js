const fs = require('fs-extra');
const chokidar = require('chokidar');
const sendTG = require('./curl');

const pkg = require('../../package.json');
const conf = pkg.motion;
console.log(conf);


const folder = conf.capture_folder;
const cams = conf.cams;
console.log(folder + cams[0].output_folder);


// var files = fs.readdirSync(folder + cams[0].output_folder)
//     .forEach(file => {
//         console.log(file);
//         });


async function send(){
    let x = await sendTG.sendVideo('/home/pack/.motion/output/cam1/13-20190330193619.mp4', '', 'holita que va el video juas juas');
    console.log('resultado' , x);
    
}

send()
var watcher = chokidar.watch(folder + cams[0].output_folder, {
  ignored: /^\./,
  persistent: true,
    // awaitWriteFinish: {
    //   stabilityThreshold: 70000,
    //   pollInterval: 200
    // },
});


watcher
  .on('add', function async (path) {
    console.log('File', path, 'has been added');
  })
  .on('change', function async (path,stats ,file) {
    console.log('File', path, 'has been changed');
    console.log('File size', stats.mode);
    console.log('File size', stats);
console.log(file);

  })
// //   .on('unlink', function async (path) {
//     console.log('File', path, 'has been removed');
//   })
//   .on('error', function async (error) {
//     console.error('Error happened', error);
//   })
//   .on('addDir', function async (path) {
//     console.log(`Directory ${path} has been added`);
//   })
//   .on('path', function async (x) {
//     console.log('Initial scan complete. Ready for changes' , x);
//   })
//   .on('raw', function async (event, path, details) {
//     console.log('Raw event info:', event, path, details);
//   })

// fs.watch(folder + cams[0].output_folder, (eventType, filename) => {
//   console.log(eventType);
//   // could be either 'rename' or 'change'. new file event and delete
//   // also generally emit 'rename'
//   console.log(filename);
// })

// curl -s -X POST "https://api.telegram.org/bot767345950:AAHt66y5UwVIdGtdq8p4lIAQD8aQcLZtBnY/sendPhoto" -F chat_id=148400127 -F photo="@/home/pack/.motion/output/cam1/CAM1_01-20190330132450-01.jpg"


// curl -s -X POST "https://api.telegram.org/bot767345950:AAHt66y5UwVIdGtdq8p4lIAQD8aQcLZtBnY/sendVideo" -F chat_id=148400127 -F video="@/home/pack/.motion/output/cam1/01-20190330132447.avi"




// curl -s -X POST "https://api.telegram.org/bot767345950:AAHt66y5UwVIdGtdq8p4lIAQD8aQcLZtBnY/sendVideo" -F chat_id=148400127 -F video="@/home/pack/.motion/output/cam1/01-20190330144124.mp4" -F thumb="@/home/pack/.motion/output/cam1/CAM1_01-20190330144126-03.min.jpg" -F caption="Movimiento en casa"
