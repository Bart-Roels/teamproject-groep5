const showData = function (jsonObject) {
  console.log(jsonObject);
  // write code to add the data to the data table
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  for (let i = 0; i < jsonObject.length; i++) {
    const tr = document.createElement('tr');
    const tdDate = document.createElement('td');
    tdDate.textContent = jsonObject[i].tijd;
    tr.appendChild(tdDate);
    const tdTime = document.createElement('td');
    tdTime.textContent = jsonObject[i].functie;
    tr.appendChild(tdTime);
    const tdLevel = document.createElement('td');
    tdLevel.textContent = jsonObject[i].type;
    tr.appendChild(tdLevel);
    const tdMessage = document.createElement('td');
    tdMessage.textContent = jsonObject[i].message;
    tr.appendChild(tdMessage);
    tbody.appendChild(tr);
  }
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
