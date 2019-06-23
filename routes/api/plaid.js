const express = require("express");
const plaid = require("plaid");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const mongoose = require("mongoose");

// Load Account and User Models
const Account = require("../../models/Account");
const User = require("../../models/User");

const keys = require("../../config/keys")

const PLAID_CLIENT_ID = keys.PlaidClientdID;
const PLAID_SECRET = keys.PlaidSecret;
const PLAID_PUBLIC_KEY = "38036bd32f9cfd2a27b89a56cc321e";

const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: "2019-05-29"}
);

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

module.exports = router;
