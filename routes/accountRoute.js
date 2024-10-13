/* *******************************
* Accounts Routes
* Week 4
* ******************************* */
const express = require("express")
const router = new express.Router()
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

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

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildLoginManagement))
  
// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router