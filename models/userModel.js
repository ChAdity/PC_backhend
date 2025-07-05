// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

// const Schema = mongoose.Schema

// const userSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// })



// // static signup method
// userSchema.statics.signup = async function(email, password) {

//   // validation
//   if (!email || !password) {
//     throw Error('All fields must be filled')
//   }

//   const exists = await this.findOne({ email })

//   if (exists) {
//     throw Error('Email already in use')
//   }

//   const salt = await bcrypt.genSalt(10)
//   const hash = await bcrypt.hash(password, salt)

//   const user = await this.create({ email, password: hash })

//   return user
// }

// // static login method
// userSchema.statics.login = async function(email, password) {

//   if (!email || !password) {
//     throw Error('All fields must be filled')
//   }

//   const user = await this.findOne({ email })
//   if (!user) {
//     throw Error('Incorrect email')
//   }

//   const match = await bcrypt.compare(password, user.password)
//   if (!match) {
//     throw Error('Incorrect password')
//   }

//   return user
// }

// module.exports = mongoose.model('User', userSchema)


const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleTokens: {
    access_token: { type: String, required: false },
    refresh_token: { type: String },
    scope: { type: String },
    token_type: { type: String },
    expiry_date: { type: Number },
  },
});

// Static method to store/update Google OAuth tokens
userSchema.statics.storeGoogleTokens = async function (email, tokens) {
  let user = await this.findOne({ email });

  if (!user) {
    user = await this.create({ email, googleTokens: tokens });
  } else {
    user.googleTokens = tokens;
    await user.save();
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
