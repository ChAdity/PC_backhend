


// const fs = require("fs");
// const path = require("path");
// const { google } = require("googleapis");
// const dotenv = require("dotenv");

// dotenv.config();

// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/userinfo.email"];



// if (!process.env.GOOGLE_CREDENTIALS) {
//   throw new Error("GOOGLE_CREDENTIALS environment variable is missing!");
// }


// const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);


// const { client_id, client_secret, redirect_uris = [] } = credentials.installed || credentials.web;


// const oAuth2Client = new google.auth.OAuth2(
//   client_id,
//   client_secret,
//   redirect_uris[0]
// );

// if (process.env.GOOGLE_TOKENS) {
//   const savedTokens = JSON.parse(process.env.GOOGLE_TOKENS);
//   oAuth2Client.setCredentials(savedTokens);
// }

// function getAuthUrl() {
//   return oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
// }



// async function getAccessToken(code) {
//   const { tokens } = await oAuth2Client.getToken(code);
//   if (!tokens.access_token) {
//     throw new Error("Google OAuth: No access token received");
//   }
//   oAuth2Client.setCredentials(tokens);
//   fs.writeFileSync(tokensPath, JSON.stringify(tokens)); 
//   return tokens;
// }


// function getGmailClient() {
//   return google.gmail({ version: "v1", auth: oAuth2Client });
// }

// module.exports = { getAuthUrl, getAccessToken, getGmailClient };


const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email"
];

// Check if credentials are present
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is missing!");
}

// Parse credentials from environment
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Support both `installed` and `web` keys
const { client_id, client_secret, redirect_uris = [] } =
  credentials.installed || credentials.web;

// Use production redirect URI on Render, local redirect URI on dev
const redirectUri =
  process.env.NODE_ENV === "production"
    ? "https://pc-backhend-2.onrender.com/auth/google/callback"
    : redirect_uris[0];

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirectUri
);

// Load saved tokens from environment variable if available
if (process.env.GOOGLE_TOKENS) {
  const savedTokens = JSON.parse(process.env.GOOGLE_TOKENS);
  oAuth2Client.setCredentials(savedTokens);
}

// Function to get Google Auth URL
function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
}

// Function to get access token from code
async function getAccessToken(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  if (!tokens.access_token) {
    throw new Error("Google OAuth: No access token received");
  }
  oAuth2Client.setCredentials(tokens);

  //  No fs.writeFile here—store tokens in DB if needed
  return tokens;
}

// Function to get authenticated Gmail client
function getGmailClient() {
  return google.gmail({ version: "v1", auth: oAuth2Client });
}

module.exports = { getAuthUrl, getAccessToken, getGmailClient };
