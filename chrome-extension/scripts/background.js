/**
 * Chrome Storage Keys
 */
const LAST_REQUEST_ID = 'LAST_REQUEST_ID';
const ACO_SYNC_ID = 'ACO_SYNC_ID';

/**
 * Chrome Alarm Keys
 */
const REQUEST_ALARM = 'REQUEST_ALARM';

/**
 * Base URLs
 */
const BASE_URL = `https://jsonbox.io`;
const CODE_URL = `https://janjanmedinaaa.github.io/AndCarryOn/code.html`;

function makeACOKey(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `ACO_${result}`;
}

function saveStorage(key, value) {
  let options = {};
  options[key] = value;

  chrome.storage.sync.set(options);
}

function sendNotification(title, message){
  var params = {
    type: "basic",
    iconUrl: "../images/icon.png",
    title,
    message
  }

  chrome.notifications.create(params);
}

function validateLastRequestID(response) {
  if (response.length == 0) return

  var id = response[0]._id;
  chrome.storage.sync.get([LAST_REQUEST_ID], function(result) {
    if (result[LAST_REQUEST_ID] == id) return
    saveStorage(LAST_REQUEST_ID, id);
    openTab(response[0].url);
  });
}

function createNewAcoCode() {
  var code = makeACOKey(17);
  saveStorage(ACO_SYNC_ID, code);

  sendNotification(
    'Created ACO Code',
    `Your new code is: ${code}`
  )
  openTab(`${CODE_URL}?code=${code}`);
}

function openTab(url) {
  chrome.tabs.create({ url });
}

function requestLatestURL() {
  chrome.storage.sync.get([ACO_SYNC_ID], function(result) {
    var id = result[ACO_SYNC_ID] || ''
    if (id == '') return

    fetch(`${BASE_URL}/${id}?limit=1`)
      .then(response => response.json())
      .then(data => validateLastRequestID(data))
  });
}

function requestDeleteItems() {
  chrome.storage.sync.get([ACO_SYNC_ID], function(result) {
    var id = result[ACO_SYNC_ID] || ''
    if (id == '') {
      createNewAcoCode();
      return
    }

    fetch(`${BASE_URL}/${id}?q=url:http*`, {
      method: 'delete'
    }).then(() => createNewAcoCode())
  });
}

// Delete All Items and Request a new ACO Code
chrome.browserAction.onClicked.addListener(function() {
  requestDeleteItems();
});

// Setup Alarm every 4.2s on Install or Update
chrome.runtime.onInstalled.addListener(function() {
  requestDeleteItems();
  chrome.alarms.create(REQUEST_ALARM, { periodInMinutes: 0.07 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name != REQUEST_ALARM) return
  requestLatestURL();
});