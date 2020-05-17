(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/AndCarryOn/sw.js', { scope: '/AndCarryOn/' })
     .then(function() { 
        console.log('Service Worker Registered'); 
      });
  }
  toggleSpinner(false)
})()

const JSONBOX_ID = 'box_daa5a833190893fb9a3b'
const BASE_URL = `https://jsonbox.io/${JSONBOX_ID}`

function sendRequest(url) {
  if (url == '') return

  toggleSpinner(true)
  disableButton(true)

  fetch(BASE_URL, {
    method: 'post',
    body: JSON.stringify({ url }),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(() => {
    document.getElementById('carryOnUrl').value = ''
    toggleSpinner(false)
    disableButton(false)
  })
  .catch(() => {
    toggleSpinner(false)
    disableButton(false)
  })
}

function toggleSpinner(show) {
  document.getElementById('carryOnSpinner').hidden = !show
}

function disableButton(disable) {
  document.getElementById('carryOnButton').disabled = disable
}

function carryOnClicked() {
  var url = document.getElementById('carryOnUrl').value
  sendRequest(url)
}

window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location)

  var url = parsedUrl.searchParams.get('url')
  var text = parsedUrl.searchParams.get('text')
  var title = parsedUrl.searchParams.get('title')
  
  var currentUrl = url || text || title || ''
  document.getElementById('carryOnUrl').value = currentUrl
  // sendRequest(currentUrl)
});