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

// route POST api/plaid/accounts/add
// Trades public token for access token and stores credentials in database
// Private
router.post(
  "/accounts/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    PUBLIC_TOKEN = req.body.public_token;

    const userId = req.user.id;

    const institution = req.body.metadata.institution;
    const { name, institution_id } = institution;

    if(PUBLIC_TOKEN) {
      client
        .exchangePublicToken(PUBLIC_TOKEN)
        .then(exchangeResponse => {
          ACCESS_TOKEN = exchangeResponse.access_token;
          ITEM_ID = exchangeResponse.item_id;
          // check if account already exists for specific user
          Account.findOne({
            userId: req.user.id,
            institutionId: institution_id
          })
            .then(account => {
              if(account) {
                console.log("Account already exists");
              }
              else {
                const newAccount = new Account({
                  userId: userId,
                  accessToken: ACCESS_TOKEN,
                  itemId: ITEM_ID,
                  institutionId: institution_id,
                  institutionName: name
                });
                newAccount.save().then(account => res.json(account));
              }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }
);

// route DELETE api/plaid/accounts/:id
// Delete account with given id
// Private
router.delete(
  "/accounts/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findById(req.params.id).then(account => {
      account.remove().then(() => res.json({ success: true }));
    })
  }
)

// route GET api/plaid/accounts
// Get all accounts linked with plaid for specific user
// Private
router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  (req,res) => {
    Account.find({ userId: req.user.id})
      .then(accounts => res.json(accounts))
      .catch(err => console.log(err));
  }
);

// route POST api/plaid/accounts/transactions
// Fetch transactions from past 30 days from all linked accounts
// Private
router.post(
  "/accounts/transactions",
  passport.authenticate("jwt", { session: false }),
  (req,res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

    let transactions = [];
    const accounts = req.body;

    if(accounts) {
      accounts.forEach(function(account) {
        ACCESS_TOKEN = account.accessToken;
        const institutionName = account.institutionName;

        client
          .getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
          .then(response => {
            transactions.push({
              accountName: institutionName,
              transactions: response.transactions
            });
            // dont send back res until all transactions have been added
            if(transactions.length === accounts.length) {
              res.json(transactions);
            }
          })
          .catch(err => console.log(err));
      });
    }
  }
);

module.exports = router;
