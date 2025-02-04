const utilities = require(".")
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
      
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  validate.loginRules = () => {
    return [
  // valid email is required and should already exist in the database
  body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (!emailExists){
      throw new Error("Email doesn't exist. Please log in using a different email")
    }
  }),
  
  // password is required and must be strong password
  body('account_password')
  .trim()
  .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
  })
  //
  .withMessage('Password does not meet requirements.')
  .custom(async (account_password, { req }) => {
      const retrievedPasswordHash = await accountModel.checkPassword(req.body.account_email);
      const isMatch = await bcrypt.compare(account_password, retrievedPasswordHash);
      if (!isMatch) {
          throw new Error('Sorry, wrong password');
      }
  })
]
}//

validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* Updata account Data */
validate.updateAccountRules = () => {
  return [
  // firstname is required and must be string
  body("account_firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.
  
  // lastname is required and must be string
  body("account_lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.
  
  // valid email is required and cannot already exist in the database
  body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  })]}

  validate.checkUpdateAccountData= async (req, res, next) => {
    const { account_firstname, account_lastname, account_email,account_id, } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./account/update-account", {
        errors,
        title: "Edit Account",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
      return
    }
    next()
  }

  /* CHANGE PASSWORD */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
]}

validate.checkPasswordUpdate= async (req, res, next) => {
  const { account_password, account_id, } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      account_password,
      account_id
    })
    return
  }
  next()
}

validate.checkAccountTypeData= async (req, res, next) => {
  const { account_id,account_type } = req.body
  const account_typeExists = await accountModel.checkExistingAccountType(account_id,account_type)
  if (account_typeExists){
    throw new Error(`The  user already belongs to that account type. Please try selecting a different account_type`)
  }
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountsData = await accountModel.getAccountById(account_id)
    const accountsSelect= await utilities.buildAccountsList(accountsData)
    res.render("account/accounts-management", {
      errors,
      title: "Manage Accounts",
      nav,
      accountsSelect
    })
    return
  }
  next()
}
  
  module.exports = validate