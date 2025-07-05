// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");
// const dotenv = require("dotenv");

// dotenv.config();

// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// const credentialsPath = path.join(__dirname, "credentials.json");

// if (!fs.existsSync(credentialsPath)) {
//   throw new Error("credentials.json file is missing!");
// }

// const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

// if (!credentials.web) {
//   throw new Error(" Invalid credentials.json format. Missing 'web' key.");
// }

// const { client_id, client_secret, redirect_uris = [] } = credentials.web;

// if (!redirect_uris.length) {
//   throw new Error(" Missing 'redirect_uris' in credentials.json");
// }

// //  Define oAuth2Client before using it
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// function getAuthUrl() {
//   return oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
// }

// async function getAccessToken(code) {
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);
//   return tokens;
// }

// // Export oAuth2Client properly
// module.exports = { getAuthUrl, getAccessToken, oAuth2Client };


const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/userinfo.email"];
const credentialsPath = path.join(__dirname, "credentials.json");
const tokensPath = path.join(__dirname, "tokens.json");

if (!fs.existsSync(credentialsPath)) {
  throw new Error("credentials.json file is missing!");
}

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
const { client_id, client_secret, redirect_uris = [] } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Load saved tokens if available
if (fs.existsSync(tokensPath)) {
  const savedTokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));
  oAuth2Client.setCredentials(savedTokens);
}

// Function to get Google Auth URL
function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

// Function to exchange code for access tokens
// async function getAccessToken(code) {
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);
//   fs.writeFileSync(tokensPath, JSON.stringify(tokens)); // Save tokens
//   return tokens;
// }

async function getAccessToken(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  if (!tokens.access_token) {
    throw new Error("Google OAuth: No access token received");
  }
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(tokensPath, JSON.stringify(tokens)); // Save tokens
  return tokens;
}


// Function to get an authenticated Gmail client
function getGmailClient() {
  return google.gmail({ version: "v1", auth: oAuth2Client });
}

module.exports = { getAuthUrl, getAccessToken, getGmailClient };

