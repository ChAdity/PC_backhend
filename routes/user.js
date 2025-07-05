const express = require('express')

// controller functions
const { loginUser, signupUser } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router

// const express = require("express");
// // const passport = require("passport");

// const { loginUser, signupUser } = require("../controllers/userController");

// const router = express.Router();

// // Login route
// router.post("/login", loginUser);

// // Signup route
// router.post("/signup", signupUser);

// // Google Auth route
// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account", // Ensures Google asks for account selection
//   })
// );

// // Google Auth callback route
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: true, // Ensures session is used
//   }),
//   (req, res) => {
//     res.redirect("http://localhost:3000/calendar"); // Redirect to frontend after login
//   }
// );

// Logout route
// router.get("/auth/logout", (req, res) => {
//   req.logout(() => {
//     res.clearCookie("connect.sid"); // Clear session cookie
//     req.session.destroy();
//     res.send({ success: true });
//   });
// });

// module.exports = router;
