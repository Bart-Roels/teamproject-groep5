const fs = require('fs');
const readline = require('readline');

const rl =readline.createInterface({
    input:fs.createReadStream('app.log')
})

rl.on('line',(line)=>{
    console.log(line);})

/*document.addEventListener('DOMContentLoaded', function () {
  var table = new DataTable('#example');
  getData();
});*/
