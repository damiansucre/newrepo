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
      module.exports = validate