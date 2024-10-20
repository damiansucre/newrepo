/* *******************************
* Accounts Routes
* Week 4
* ******************************* */
const express = require("express")
const router = new express.Router()
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const { check } = require("express-validator");

/* *******************************
* Deliver Login View
* Week 4
* ******************************* */
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/* *******************************
* Deliver Registration View
* Week 4
* ******************************* */
// Process the registration data
router.post(
  '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// week 4 Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildLoginManagement))

// Update Account Settings
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.editAccountData));

router.post("/update-info", 
  utilities.checkLogin, 
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountData))

// Change Password
router.post("/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordUpdate,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountPassword))

/* Update Account Type /Delete Accounts Routes */
router.get("/accounts-management", utilities.checkLogin,utilities.accountTypeCheckAdmin, utilities.handleErrors(accountController.buildAccountManagement))

router.get("/accounts-management/:account_id", utilities.checkLogin, utilities.accountTypeCheckAdmin, utilities.handleErrors(accountController.getAccountsJSON))

// Updating account type check
router.post('/accounts-management',
utilities.checkLogin, 
utilities.accountTypeCheckAdmin,
utilities.handleErrors(accountController.updateAccountType))

//DELETE accounts 
router.post("/account-delete", 
utilities.checkLogin, 
utilities.accountTypeCheckAdmin,
utilities.handleErrors(accountController.deleteAccount))

module.exports = router