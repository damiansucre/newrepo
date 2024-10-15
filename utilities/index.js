const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Car details week 3
* ************************************ */
Util.buildCarDetails = async function(data){
  let info
  if(data.length > 0){
    info = '<div id="inv-details">'
    data.forEach(vehicle => { 
      // info += `<h1>${vehicle.inv_year} ${vehicle.inv_make}  ${vehicle.inv_model}</h1>`
      
      info +=  '<img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +'" title="'+vehicle.inv_make + ' '+ vehicle.inv_model+'">'
      info+='<h2>Details:</h2>'
      info+= `<p><span class="subtitles">Description:</span> ${vehicle.inv_description}</p>`
      info+= '<p><span class="subtitles">Price:</span> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
      info+= `<p><span class="subtitles">Make:</span> ${vehicle.inv_model}</p>`
      info+= `<p><span class="subtitles">Model:</span> ${vehicle.inv_make}</p>`
      info+= `<p><span class="subtitles">Color:</span> ${vehicle.inv_color}</p>`
      info+= `<p><span class="subtitles">Mileage:</span> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`
    })
      info += '</div>'
  } else { 
    info += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return info
}

Util.getOptions = async function(classification_id){
  let data = await invModel.getClassifications();
  let option = '<select name="classification_id" id="classification_id" required>';
  option += '<option value="">Select a Vehicle Classification</option>';
  data.rows.forEach((row) => {
    const isSelected = Number(row.classification_id) === Number(classification_id) ? 'selected' : '';
    option += `<option value="${row.classification_id}" ${isSelected}>${row.classification_name}</option>`;
  });

  option += '</select>';
  return option;
};

Util.buildClassificationList = async function(classification_id){
  let data = await invModel.getClassifications()
  let option = '<select name="classification_id" id="classificationList" required>';
  option += '<option value="">Select a Vehicle Classification</option>';
  data.rows.forEach((row) => {
    const isSelected = Number(row.classification_id) === Number(classification_id) ? 'selected' : '';
  option += `<option value="${row.classification_id}" ${isSelected}>${row.classification_name}</option>`;
  });
    option += '</select>';
    return option
  }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.accountTypeCheck = (req, res, next) => {
  const account_type =res.locals.accountData.account_type
    if (account_type == 'Employee' || account_type == 'Admin') {
      next()
    } else {
      req.flash("notice", "Sorry, you're account type does not have the rights to access here")
      return res.redirect("/account/")
    }
 }

 Util.accountTypeCheckAdmin = (req, res, next) => {
  const account_type =res.locals.accountData.account_type
    if (account_type == 'Admin') {
      next()
    } else {
      req.flash("notice", "Sorry, you're account type does not have the rights to access here")
      return res.redirect("/account/")
    }
 }

 /* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util