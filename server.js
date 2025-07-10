

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const userRoutes = require("./routes/user");
const User = require("./models/userModel");
const { getAuthUrl, getAccessToken, getGmailClient } = require("./GmailAuth");
const Email = require("./models/emailModel");
const { extractDetails } = require("./nlpProcessor");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pc-frontend-vy53.vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/user", userRoutes);

app.get("/auth/google", (req, res) => {
  res.redirect(getAuthUrl());
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "No authorization code received" });

    const tokens = await getAccessToken(code);
    const gmail = getGmailClient(tokens.access_token);

    const userInfo = await gmail.users.getProfile({ userId: "me" });
    const email = userInfo.data.emailAddress;

    if (!email) return res.status(500).json({ error: "Failed to fetch user email" });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, googleTokens: tokens });
    } else {
      user.googleTokens = tokens;
    }
    
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/Calendar`);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});


app.get("/fetch-emails", async (req, res) => {
  try {
      const gmail = getGmailClient();
      const response = await gmail.users.messages.list({
          userId: "me",
          maxResults: 200, 
      });

      const messages = response.data.messages || [];
      if (messages.length === 0) {
          return res.json({ message: "No emails found." });
      }

      const emailData = await Promise.all(
          messages.map(async (message) => {
              const msg = await gmail.users.messages.get({
                  userId: "me",
                  id: message.id,
              });

              const headers = msg.data.payload.headers;

             
              const subject = headers.find(header => header.name === "Subject")?.value || "No Subject";
              const snippet = msg.data.snippet || "";
              const messageId = msg.data.id; 

              
              const emailDateHeader = headers.find(header => header.name === "Date")?.value || "";
              const rawReceivedDate = new Date(emailDateHeader).toDateString(); 
              const receivedDate = cleanReceivedDate(rawReceivedDate); 

             
              if (!/\b(interview|placement|internship|test link)\b/i.test(subject)) {
                  return null;
              }

              
              const extractedDetails = extractDetails(subject + " " + snippet);
              if (!extractedDetails) return null;

              console.log("Extracted Email Data:", extractedDetails);

              
              const email = await Email.findOneAndUpdate(
                  { messageId },
                  { 
                      $set: { 
                          SUBJECT: subject, 
                          DATE: receivedDate,  
                          DEADLINE: extractedDetails.DEADLINE || [],
                          messageId: messageId 
                      } 
                  },
                  { upsert: true, new: true } 
              );

              return {
                  SUBJECT: subject,
                  DATE: receivedDate,  
                  DEADLINE: extractedDetails.DEADLINE || [],
                  messageId: messageId  // 
              };
          })
      );

      res.json(emailData.filter(email => email !== null));
  } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
  }
});
function cleanReceivedDate(receivedDate) {
  if (!receivedDate) return "";  
  return receivedDate.replace(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s*/i, '');
}

// Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & Listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });






