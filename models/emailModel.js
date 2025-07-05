// const mongoose = require("mongoose");

// const EmailSchema = new mongoose.Schema({
//   subject: String,
//   date: Date,
//   deadline: Date,
//   rawText: String, // Stores the full email text
// });

// module.exports = mongoose.model("Email", EmailSchema);

const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    messageId: { type: String, unique: true, required: true }, // Ensure messageId is unique and required
    ORG: [String],
    JOB_ROLE: [String],
    DATE: [String],
    LOCATION: [String],
    STIPEND: [String],
    SKILLS: [String],
    DURATION: [String],
    DEADLINE: [String] 
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;





