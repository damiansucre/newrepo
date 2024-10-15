const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

invCont.buildByDetails= async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getCarDetails(inv_id)
  const grid = await utilities.buildCarDetails(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_year +' '+ data[0].inv_model +' ' + data[0].inv_make
  res.render("./inventory/carDetails", {
    title: vehicleName + " vehicle",
    nav,
    grid,
    errors: null,
  })
}

invCont.buildInventoryManagement = async function(req, res){
  const inv_id = req.params.inv_id
  const data = await invModel.getCarDetails(inv_id)
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList(data)
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect
  })
}

invCont.buildClassification = async function(req, res){
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.buildInventory = async function(req, res){
  const inv_id = req.params.inv_id
  const data = await invModel.getCarDetails(inv_id)
  let nav = await utilities.getNav()
  let options = await utilities.getOptions(data)
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    options,
    errors: null,
  })
}

/* ****************************************
*  Adding a New Classification Process
* *************************************** */
invCont.addNewClassification = async function(req,res){
  const { classification_name } = req.body

  const classResult = await invModel.insertClassification(classification_name)
  
  let nav = await utilities.getNav()
  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name}, to the navigation bar.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the new classification name could not be added.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

/* ****************************************
*  Adding Inventory Process
* *************************************** */
invCont.addNewVehicle= async function(req,res){
  const { inv_make, inv_model, inv_year, inv_description, inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id } = req.body
  const vehicleResult = await invModel.insertInventory(inv_make, inv_model, inv_year, inv_description, inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id)
  let nav = await utilities.getNav()

  if (vehicleResult) {
    req.flash(
      "notice",
      'Congratulations, you added a new vehicle.'
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the new classification name could not be added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      options,
      errors: null
    })
  }
}

module.exports = invCont