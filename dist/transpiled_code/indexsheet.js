"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readValue = readValue;
exports.authorize = authorize;
exports.listMajors = listMajors;
window.addEventListener('load', function () {
  var fs = require('file-system');

  var _require = require('googleapis'),
      google = _require.google;

  var readline = require('readline');
}); // const blogger = google.blogger({
//   version: 'v3',
//   auth: 'YOUR API KEY'
// });
// If modifying these scopes, delete token.json.

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; // The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

var TOKEN_PATH = 'token.json';

function readValue(val) {
  if (val == "go") {
    fs.readFile('cred.json', function (err, content) {
      if (err) return console.log('Error loading client secret file:', err); // Authorize a client with credentials, then call the Google Sheets API.

      authorize(JSON.parse(content), listMajors);
    });
  }
} // // Load client secrets from a local file.


function authorize(credentials, callback) {
  var _credentials$installe = credentials.installed,
      client_secret = _credentials$installe.client_secret,
      client_id = _credentials$installe.client_id,
      redirect_uris = _credentials$installe.redirect_uris;
  var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]); // Check if we have previously stored a token.
  // fs.readFile(TOKEN_PATH, (err, token) => {
  //   if (err) return getNewToken(oAuth2Client, callback);
  //   oAuth2Client.setCredentials(JSON.parse(token));

  callback(oAuth2Client); // });
}

function listMajors(auth) {
  var sheets = google.sheets({
    version: 'v4',
    auth: auth
  }); //     // sheets.spreadsheets.values.get({
  //     //     spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  //     //     range: 'Class Data!A2:E',
  //     // }, (err, res) => {
  //     //     if (err) return console.log('The API returned an error: ' + err);
  //     //     const rows = res.data.values;
  //     //     if (rows.length) {
  //     //     console.log('Name, Major:');
  //     //     // Print columns A and E, which correspond to indices 0 and 4.
  //     //     rows.map((row) => {
  //     //         console.log(`${row[0]}, ${row[4]}`);
  //     //     });
  //     //     } else {
  //     //     console.log('No data found.');
  //     //     }
  //     // });

  var resource = {
    properties: {
      title: title
    }
  };
  sheets.spreadsheets.create({
    resource: resource,
    fields: 'spreadsheetId'
  }, function (err, spreadsheet) {
    if (err) {
      // Handle error.
      console.log(err);
    } else {
      console.log("Spreadsheet ID: ".concat(spreadsheet.spreadsheetId));
    }
  });
}