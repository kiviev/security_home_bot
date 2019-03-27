


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
     }


}