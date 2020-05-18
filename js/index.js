const BASE_URL = `https://jsonbox.io`;
const ACO_SYNC_ID_KEY = 'ACO_SYNC_ID_KEY';

var currentUrl = '';

(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/AndCarryOn/sw.js', { scope: '/AndCarryOn/' })
     .then(function() { 
        console.log('Service Worker Registered'); 
      });
  }

  setupCodeInputListener();
  toggleSpinner(false);
})()

function setupCodeInputListener() {
  let input = document.getElementById('codeInput');
  let timeout = null;

  input.value = getAcoSyncID();
  input.addEventListener('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => saveAcoSyncID(input.value), 500);
  });
}

function sendRequest(acoSyncId) {
  if (currentUrl == '') return

  toggleSpinner(true);
  disableButton(true);

  fetch(`${BASE_URL}/${acoSyncId}`, {
    method: 'post',
    body: JSON.stringify({ url: currentUrl }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(() => {
    document.getElementById('acoInput').value = '';
    toggleSpinner(false);
    disableButton(false);
  })
  .catch(() => {
    toggleSpinner(false);
    disableButton(false);
  })
}

function saveAcoSyncID(id) {
  localStorage.setItem(ACO_SYNC_ID_KEY, id);
}

function getAcoSyncID() {
  return localStorage.getItem(ACO_SYNC_ID_KEY) || '';
}

function toggleSpinner(show) {
  document.getElementById('loader').hidden = !show;
}

function disableButton(disable) {
  document.getElementById('sendButton').disabled = disable;
}

function sendButtonClicked() {
  currentUrl = document.getElementById('acoInput').value;
  sendRequest(getAcoSyncID())
}

window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);

  var url = parsedUrl.searchParams.get('url');
  var text = parsedUrl.searchParams.get('text');
  var title = parsedUrl.searchParams.get('title');
  
  currentUrl = url || text || title || '';
  sendRequest(getAcoSyncID());
});