


const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/userinfo.email"];


// Check if credentials are present
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is missing!");
}

// Parse credentials from environment
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Support both `installed` and `web` keys (depends on how you generated your credentials)
const { client_id, client_secret, redirect_uris = [] } = credentials.installed || credentials.web;

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
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
  });
}



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

