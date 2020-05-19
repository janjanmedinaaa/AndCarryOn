const PORT = 3000;
const IP_ADDRESS_KEY = 'IP_ADDRESS_KEY';

var currentUrl = '';

(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/AndCarryOn/sw.js', { scope: '/AndCarryOn/' })
     .then(function() { 
        console.log('Service Worker Registered'); 
      });
  }

  setupIPInputListener();
})()

function setupIPInputListener() {
  let input = document.getElementById('ipAddressInput');
  let timeout = null;

  input.value = getIPAddress();
  input.addEventListener('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => saveIPAddress(input.value), 500);
  });
}

function sendRequest(ip) {
  if (ip == '' || currentUrl == '') return

  fetch(`http://${ip}:${PORT}?url=${currentUrl}`, {
    mode: 'no-cors' // 'cors' by default
  })
  document.getElementById('acoInput').value = ''
}

function saveIPAddress(id) {
  localStorage.setItem(IP_ADDRESS_KEY, id);
}

function getIPAddress() {
  return localStorage.getItem(IP_ADDRESS_KEY) || '';
}

document.addEventListener('swiped-up', function(e) {
  currentUrl = document.getElementById('acoInput').value
  sendRequest(getIPAddress());
});

window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);

  var url = parsedUrl.searchParams.get('url');
  var text = parsedUrl.searchParams.get('text');
  var title = parsedUrl.searchParams.get('title');
  
  currentUrl = url || text || title || '';
  sendRequest(getIPAddress());
});