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

const BASE_URL = `https://jsonbox.io`
const ACO_SYNC_ID_KEY = 'ACO_SYNC_ID_KEY'

var currentUrl = ''
var requestOnSave = false

function sendRequest(acoSyncId) {
  if (currentUrl == '') return
  if (acoSyncId == '') {
    requestOnSave = true
    toggleModal(true)
    return
  }

  toggleSpinner(true)
  disableButton(true)

  fetch(`${BASE_URL}/${acoSyncId}`, {
    method: 'post',
    body: JSON.stringify({ url: currentUrl }),
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

function saveAcoSyncID(id) {
  localStorage.setItem(ACO_SYNC_ID_KEY, id)
}

function getAcoSyncID() {
  return localStorage.getItem(ACO_SYNC_ID_KEY) || ''
}

function toggleModal(show) {
  var modal = document.querySelector('dialog')
  var acoSyncIdInput = modal.querySelector('#acoSyncId')

  if (show) {
    acoSyncIdInput.parentNode.MaterialTextfield.change(getAcoSyncID())
    modal.showModal()
  } else {
    acoSyncIdInput.value = ''
    modal.close()
  }
}

function toggleSpinner(show) {
  document.getElementById('carryOnSpinner').hidden = !show
}

function disableButton(disable) {
  document.getElementById('carryOnButton').disabled = disable
}

function saveClicked() {
  var modal = document.querySelector('dialog')
  var asoSyncId = modal.querySelector('#acoSyncId').value

  saveAcoSyncID(asoSyncId)
  toggleModal(false)

  if (requestOnSave) {
    requestOnSave = false
    sendRequest(getAcoSyncID())
  }
}

function carryOnClicked() {
  currentUrl = document.getElementById('carryOnUrl').value
  sendRequest(getAcoSyncID())
}

window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location)

  var url = parsedUrl.searchParams.get('url')
  var text = parsedUrl.searchParams.get('text')
  var title = parsedUrl.searchParams.get('title')
  
  currentUrl = url || text || title || ''
  sendRequest(getAcoSyncID())
});