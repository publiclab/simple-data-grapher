window.addEventListener('load', function(){
  const fs = require('file-system');
  const {google} = require('googleapis');
  const readline = require('readline');
});
  
// const blogger = google.blogger({
//   version: 'v3',
//   auth: 'YOUR API KEY'
// });
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json';

export function readValue(val){
    if (val=="go"){
        fs.readFile('cred.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), listMajors);
          });
    }
}

// // Load client secrets from a local file.

// export function authorize(credentials, callback) {
//     const {client_secret, client_id, redirect_uris} = credentials.installed;
//     const oAuth2Client = new google.auth.OAuth2(
//         client_id, client_secret, redirect_uris[0]);
  
//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//     //   if (err) return getNewToken(oAuth2Client, callback);
//       oAuth2Client.setCredentials(JSON.parse(token));
//       callback(oAuth2Client);
//     });
//   }
export function listMajors(auth) {
    const sheets = google.sheets({version: 'v4', auth});
//     // sheets.spreadsheets.values.get({
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
    const resource = {
        properties: {
          title,
        },
      };
    sheets.spreadsheets.create({
        resource,
        fields: 'spreadsheetId',
        }, (err, spreadsheet) =>{
        if (err) {
            // Handle error.
            console.log(err);
        } else {
            console.log(`Spreadsheet ID: ${spreadsheet.spreadsheetId}`);
        }
    });
}
