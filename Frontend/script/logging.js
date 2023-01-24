const showData = function (data) {
  console.log(data);
  handleDataErrors(data);
};

const handleDataErrors = function(url){
  console.log('handleDataErrors');



  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Get the tbody element to add rows to
      let logBody = document.getElementById("logBody");

      // Loop through each log entry
      data.forEach(entry => {
        // Split the entry string into an array of values
        let entryValues = entry.split(" - ");
        // Extract the date, name, type, and error values
        let date = entryValues[0];
        let name = entryValues[1];
        let type = entryValues[2];
        let error = entryValues[3];

        // Create a new row and cells for the table
        let row = logBody.insertRow();
        let dateCell = row.insertCell();
        let nameCell = row.insertCell();
        let typeCell = row.insertCell();
        let errorCell = row.insertCell();

        // Set the inner text of each cell to the corresponding value
        dateCell.innerText = date;
        nameCell.innerText = name;
        typeCell.innerText = type;
        errorCell.innerText = error;
      });
    });
};
const getData = function () {
  console.log('getData');
  const url = 'http://127.0.0.1:5000/api/v1/logs';
  handleDataErrors(url);
};
document.addEventListener('DOMContentLoaded', function () {
  console.info('DOM geladen');
  // initialize the datatable 
  var table = new DataTable('#logTable', {
    data: { 
      headings: ['Date', 'Name', 'Type', 'Error'],
      data: []
    },
    columns: [
      { select: 0, type: 'date', format: 'DD/MM/YYYY' },
      { select: 1, type: 'text' },
      { select: 2, type: 'text' },
      { select: 3, type: 'text' }
    ],
    layout: {
      top: '{search}',
      bottom: '{info}{pager}'
    },
    pagination: {
      limit: 10
    },
    labels: {
      placeholder: 'Search...',
      perPage: '{select} entries per page',
      noRows: 'No entries found',
      info: 'Showing {start} to {end} of {rows} entries'
    }
  });

  getData();
});
