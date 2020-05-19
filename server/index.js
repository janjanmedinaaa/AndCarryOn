const express = require('express');
const ip = require('ip');
const open = require('open');
const normalizeUrl = require('normalize-url');

const app = express();
const PORT = 3000;

const openItem = async(item) => {
  if (item === '') return;
  await open(urlFormat(item));
}

const urlFormat = (url) => {
  return normalizeUrl(url, {
    defaultProtocol: 'https://',
    forceHttps: true,
    stripAuthentication: false
  });
}

app.get('/', (req, res) => {
  var url = req.query.url || '';
  var message = 
    (url === '') ? 'URL Parameter required.' : `Opening ${url}.`;

  openItem(url)
  res.json({ url, message });
});

app.listen(PORT, () => {
  console.log(`Running on ${ip.address()}:${PORT}`);
});