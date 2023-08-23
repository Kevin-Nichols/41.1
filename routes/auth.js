const express = require("express");
const ExpressError = require("../expressError");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {SECRET_KEY} = require("../config");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async (req, res, next) => {
  try {
    let {username, password} = req.body;
    if (await User.authenticate(username, password)) {
      let webToken = jwt.sign({username}, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({webToken});
    } else {
      throw new ExpressError("Incorrect username or password", 400);
    }
  } catch (e) {
    return next(e);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) => {
  try {
    let {username} = await User.register(req.body);
    let webToken = jwt.sign({username}, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({webToken});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;