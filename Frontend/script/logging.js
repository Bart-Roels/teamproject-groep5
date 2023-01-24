const showData = function (data) {
  // initialize the datatable
  var table = new DataTable('#example', {
    data: data,
    bInfo: false,
    responsive: true,
    bDestroy: true,
    layout: {
      top: '{search}',
      bottom: '{info}{pager}',
    },
    pagination: {
      limit: 10,
    },
    labels: {
      placeholder: 'Search...',
      perPage: '{select} entries per page',
      noRows: 'No entries found',
      info: 'Showing {start} to {end} of {rows} entries',
    },
  });
};

const getData = function () {
  console.log('getData');
  const url = 'http://127.0.0.1:5000/api/v1/logs';

  fetch(url)
    .then((response) => response.json())
    .then((data) => showData(data));
};

document.addEventListener('DOMContentLoaded', function () {
  console.info('DOM geladen');
  getData();
});
