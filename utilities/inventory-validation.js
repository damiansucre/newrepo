const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

validate.classificationRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 3 })
        .isAlpha().withMessage('Input must contain only alphabetical characters')
        .withMessage("Please provide a valid classification name with only alphabetical characters") // on error this message is sent.
        .custom(async (classification_name) => {
          const classificationExists = await invModel.checkExistingclassification(classification_name)
          if (classificationExists){
            throw new Error("Classification aleready exists. Please try adding a different name")
          }
        })
      ]}
      validate.checkClassificationData = async (req, res, next) => {
        const { classification_name } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          let nav = await utilities.getNav()
          res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
          })
          return
        }
        next()
      }

      validate.vehicleRules = () => {
        return [
          // classification_id is required and must be string
          body("classification_id")
            .notEmpty().withMessage('Please select a classification name from the dropdown.'),
      
          // inv_make is required and must be string
          body("inv_make")
            .trim()
            .isLength({ min: 3 }).withMessage("Please provide a make.") // on error this message is sent.
            .matches(/^[a-zA-Z0-9\- ]+$/).withMessage('The model name format is not valid'),
      
      // valid email is required and cannot already exist in the database
      body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a last name.") // on error this message is sent.
      .matches(/^[a-zA-Z0-9\- ]+$/).withMessage('The model name format is not valid'),
  
      body("inv_image")
      .trim()
      .isLength({ min: 4 }).withMessage("Please provide a file path on image.") // Validate non-empty
      .matches(/^(\/[a-zA-Z0-9_\-]+)+(\/[a-zA-Z0-9_\-]+\.\w+)?\/?$/).withMessage('Image path has an invalid format'),
  
      body("inv_thumbnail")
      .trim()
      .isLength({ min: 4 }).withMessage("Please provide a file path on thumbnail.") // on error this message is sent.
      .matches(/^(\/[a-zA-Z0-9_\-]+)+(\/[a-zA-Z0-9_\-]+\.\w+)?\/?$/).withMessage('Thumbnail path has an invalid format'),
      
      body("inv_description")
      .trim()
      .isLength({ min: 4 }).withMessage("Please add description to the vehicle."), // on error this message is sent.
  
      body("inv_year")
      .trim()
      .isLength({ max: 4 }).withMessage("Please add a four-digit year.") // on error this message is sent.
      .isInt({ min: 1000, max: 9999 }).withMessage('Year must be a four-digit year'),
  
      body("inv_miles")
      .trim()
      .isLength({ min: 1 }).withMessage("Please add  the amount of miles") // on error this message is sent.
      .isNumeric().withMessage("Amount of miles is not a valid number"),
      
      body("inv_price")
      .trim()
      .isLength({ min: 1 }).withMessage("Please add a price.") // on error this message is sent.
      .isNumeric().withMessage("Price is not a number"),
  
      body("inv_color")
      .trim()
      .isLength({ min:3 }).withMessage("Please add a color.") // on error this message is sent.
      .matches(/^[a-zA-Z\s-]+$/).withMessage('The color name is not valid'),
      ]
    }

      validate.checkVehicleData = async (req, res, next) => {
        const { inv_make, inv_model, inv_year, inv_description, inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          let nav = await utilities.getNav()
          let options = await utilities.getOptions(classification_id)
          res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            options,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
          })
          return
        }
        next()
      }
      
      validate.checkUpdateData = async (req, res, next) => {
        const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          let nav = await utilities.getNav()
          let options = await utilities.buildClassificationList(classification_id)
          const itemData = await invModel.getCarDetails(inv_id)
          const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
          res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav,
            options,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
          })
          return inv_id
        }
        next()
      }
      
      module.exports = validate