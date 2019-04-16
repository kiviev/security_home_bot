


module.exports = {
    envToArray : (key) => {
       let envConstant = process.env[key];
       if (!envConstant || typeof envConstant !== 'string') return false;
       let arr = envConstant.split(',');
       arr.forEach(element => {
           element = element.trim();
       });
       return arr;
     },
    capitalize : (s) => {
       if (typeof s !== 'string') return ''
       return (s.charAt(0).toUpperCase() + s.slice(1)).trim();
     },
    compareTime : (str1, str2) => {
        if (str1 === str2) {
            return 0;
        }
        var time1 = str1.split(':');
        var time2 = str2.split(':');
        if (eval(time1[0]) > eval(time2[0])) {
            return 1;
        } else if (eval(time1[0]) == eval(time2[0]) && eval(time1[1]) > eval(time2[1])) {
            return 1;
        } else {
            return -1;
        }
      },
    checkFormatHour: (str) => {
      let regex = new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$");
      return str.match(regex);
    },
    objectSize : (obj) => {
        return Object.keys(obj).length;
    },
    getAbonoNum(num){
        let split = num.split(' ');
        let obj = {
            select: null,
            input: null
        };
        if(split.length && split.length == 2){
            obj.select = split[0];
            obj.input = split[1]  
        }
        return obj;
        
    },
    getAbonoResultData(data){
        let finalData = {};
        let carga = data[2].split(':');
        let validez = data[3].split(':');
        let primerUso = data[4].split(':');
        let caducidad = data[3].split(':');
        finalData['Zona'] = data[0].trim();
        finalData['Tipo de Abono'] = data[1].trim();
        finalData['Fecha de Carga'] = carga[1].trim();
        finalData['Fecha de inicio de Validez'] = validez[1].trim();
        finalData['Fecha de Primer Uso'] = primerUso[1].trim();
        finalData['Fecha de Caducidad'] = caducidad[1].trim();
        return finalData;
    }



}