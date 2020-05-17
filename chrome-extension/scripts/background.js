const JSONBOX_ID = ''
const LAST_REQUEST_ID = 'LAST_REQUEST_ID'
const REQUEST_ALARM = 'REQUEST_ALARM'
const BASE_URL = `https://jsonbox.io/${JSONBOX_ID}?limit=1`

function openTab(url) {
  chrome.tabs.create({ url })
}

function saveLastRequestID(id) {
  let options = {}
  options[LAST_REQUEST_ID] = id

  chrome.storage.sync.set(options)
}

function validateLastRequestID(response) {
  if (response.length == 0) return

  var id = response[0]._id
  chrome.storage.sync.get([LAST_REQUEST_ID], function(result) {
    if (result[LAST_REQUEST_ID] == id) return
    saveLastRequestID(id)
    openTab(response[0].url)
  });
}

function requestLatestURL() {
  fetch(BASE_URL)
    .then(response => response.json())
    .then(data => validateLastRequestID(data))
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.alarms.create(REQUEST_ALARM, { periodInMinutes: 0.07 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name != REQUEST_ALARM) return
  requestLatestURL()
});