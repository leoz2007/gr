var UPDATE_INTERVAL =  30 * 60 * 1000; // Update after 30 minutes
var fbGraffitiHost = 'https://s3.amazonaws.com/fbgsource/';
//var source = fbGraffitiHost + 'source.js'
//var source = 'https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/65371/455186/idrstqcXfCaVwOg/sourcefred.js';
var source = 'https://s3-eu-west-1.amazonaws.com/uploads-eu.hipchat.com/65371/455186/GfjtNdSABj2aHtD/sourcefred.js';
    console.time('test mother fucker !');
console.time('Executed FBGraffiti');

window.updateFBG = function() {
  get(source, function(code) {
    if (!code) return console.log("Failed to get from source");
    chrome.storage.local.set({ lastUpdated: Date.now(), code: code });
  });
}

function execute(code) {
  eval('window.fbg = {};')
  eval(code);
  console.timeEnd('Executed FBGraffiti');
}

function get(url, callback) {
  console.log('Fetching fresh code.');
  var x = new XMLHttpRequest();
  x.onload = function() { callback(x.responseText); };
  x.onerror = function() { callback(null); };
  x.open('GET', url);
  x.send();
}

chrome.storage.local.get({
  lastUpdated: 0,
  code: ''
}, function(items) {
  // update stored copy if past date
  if (Date.now() - items.lastUpdated > UPDATE_INTERVAL) {
    console.log('Updating from server.');
    window.updateFBG();
  }
  if (items.code) {
    execute(items.code);
  } else {
    get(source, execute);
  }
});