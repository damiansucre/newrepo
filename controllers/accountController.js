/* ****************************************
*  Account controller 
* *************************************** */
const utilities = require("../utilities/")
const accountModel= require('../models/account-model.js')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")//new code
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }
  
  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/register", {
      title: "Register",
      nav,
      errors:null
    })
  }

  /* async function buildLoginManagement (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login-management", {
      title: "Account Management View",
      nav,
      errors:null
    })
  } */

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 async function buildLoginManagement (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login-management", {
    title: "Account Management View",
    nav,
    errors:null
  })
}

/* ****************************************
 *  Process update data account request
 * ************************************ */
async function editAccountData(req, res, next){
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  res.render("./account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  });
}

async function updateAccountData (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,)

  if (updateResult) {
    req.flash("notice", `The account data was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
    })
  }
}

/* ****************************************
 *  Process password update request
 * ************************************ */
async function updateAccountPassword(req, res, next){
  let nav = await utilities.getNav()
  const {
    account_password,
    account_id
  } = req.body
  let hashedPassword
try {
// regular password and cost (salt is generated automatically)
hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
req.flash("notice", 'Sorry, there was an error processing the registration.')
res.status(500).render("account/update-account", {
  title: "Edit Account",
  nav,
  errors: null,
})
}
  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id,)

  if (updateResult) {
    req.flash("notice", `The account password was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/update-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_password
    })
  }
}

/* Project Controller */

async function getAccountsJSON (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  if (accountData.account_id) {
  //if (accountData.length > 0) {
    return res.json(accountData)
  } else {
  //  next(new Error("No data returned"))
  }
}

/* Update Account menu  */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = req.body
  const accountsData = await accountModel.getAccountById(account_id)
  const accountsSelect= await utilities.buildAccountsList(accountsData)
  res.render("account/accounts-management", {
    title: "Manage Accounts",
    nav,
    accountsSelect,
    errors:null
    //account_id
  })
}

async function updateAccountType (req, res, next){
  const {account_id, account_firstname, account_lastname, account_email, account_type} = req.body
  const accountsData = await accountModel.getAccountById(account_id)
  const accountsSelect= await utilities.buildAccountsList(accountsData)
  let nav = await utilities.getNav()
  const updateResult = await accountModel.updateAccountType(account_type,account_id)
  if (updateResult) {
    req.flash("notice", `The account type was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/accounts-management", {
    title: "Manage Accounts",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    accountsSelect
    })
  }
}

async function deleteAccount (req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email, account_type } = req.body
  let nav = await utilities.getNav()
  const accountsData = await accountModel.getAccountById(account_id)
  const accountsSelect= await utilities.buildAccountsList(accountsData)
  const deleteResult = await accountModel.deleteAccount(account_id)

  if (deleteResult) {
    req.flash("notice", `The account was successfully deleted.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, deletion has failed.")
    res.status(501).render("account/accounts-management", {
    title: "Manage Account",
    nav,
    accountsSelect,
    errors: null,
    account_id, 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_type
    })
  }
}

  module.exports = { buildLogin, buildRegister, buildLoginManagement, registerAccount, accountLogin, 
    editAccountData, updateAccountData, updateAccountPassword, getAccountsJSON, buildAccountManagement,
  updateAccountType, deleteAccount}