const showData = function (jsonObject) {
  let tableTest = $('#example').DataTable({
    "data": jsonObject,
    "columns": [
        { "data": "tijd" },
        { "data": "functie" },
        { "data": "message" },
        { "data": "type" }
    ],
    "searching": true,
    paging:false,
    ordering:false,
    info:false,
  })
  console.log(jsonObject);
  
};


const getData = function () {
  console.log('getData');
  const url = 'http://127.0.0.1:5000/api/v1/logs';
  handleData(url, showData);
};

document.addEventListener('DOMContentLoaded', function () {
  console.info('DOM geladen');
  getData();
});
