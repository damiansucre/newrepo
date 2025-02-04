// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invValidate = require('../utilities/inventory-validation')
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/detail/:inv_id",utilities.handleErrors(invController.buildByDetails));

/* Management Area */
router.get("/inv", utilities.accountTypeCheck, utilities.checkLogin, utilities.handleErrors(invController.buildInventoryManagement));

router.get("/add-inventory",
utilities.checkLogin,utilities.accountTypeCheck,utilities.handleErrors(invController.buildInventory));

router.post('/add-inventory',
    invValidate.vehicleRules(),
    utilities.checkLogin,
    utilities.accountTypeCheck,
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle))

router.get("/add-classification",
utilities.checkLogin,utilities.accountTypeCheck, utilities.handleErrors(invController.buildClassification));

router.post('/add-classification',
invValidate.classificationRules(),
utilities.checkLogin,
utilities.accountTypeCheck,
invValidate.checkClassificationData,
utilities.handleErrors(invController.addNewClassification))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

/* Route to Edit Vehicles */
router.get("/edit/:inv_id", utilities.accountTypeCheck, utilities.handleErrors(invController.editInventory));

/*Route to edit*/
router.post("/update/", 
    invValidate.vehicleRules(),
    utilities.checkLogin,
    utilities.accountTypeCheck,
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

/* Route to Delete Vehicles */
router.get("/delete/:inv_id", utilities.checkLogin, utilities.accountTypeCheck, utilities.handleErrors(invController.buildDeleteInventory));

router.post("/delete/", 
utilities.checkLogin, 
utilities.accountTypeCheck,
utilities.handleErrors(invController.deleteInventory))


module.exports = router;