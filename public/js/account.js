'use strict' 
 
 // Get a list of items in inventory based on the account_id 
 let accountList = document.querySelector("#accountList")
 accountList.addEventListener("change", function () { 
  let account_id = accountList.value  
  let classIdURL = "/account/accounts-management/"+account_id 
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   buildAccountTypeForm(data);
   buildDeleteAccountForm(data);
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 })


 // Build inventory items into HTML table components and inject into DOM 
 function buildAccountTypeForm(data) { 
    let accountDisplay = document.getElementById("accountTypeForm"); 
    let accountData = '<h2>Change Account Type</h2>';
    accountData += '<form action="/account/accounts-management" class="general-form" method="post">';
    accountData += `<label>Account Firstname:</label><input readonly value="${data.account_firstname}"> </input>`;
    accountData += `<label>Account Lastname:</label><input readonly value="${data.account_lastname}"></input>`;
    accountData += '<label>Account Type:</label>';
    accountData += '<select name="account_type">';
    if (data.account_type) {
        accountData += `<option name="account_type" value="Client" ${isSelected(data.account_type, 'Client')}>Client</option>`;
        accountData += `<option name="account_type" value="Employee" ${isSelected(data.account_type, 'Employee')}>Employee</option>`;
        accountData += `<option name="account_type" value="Admin" ${isSelected(data.account_type, 'Admin')}>Admin</option>`;
    }
    accountData += '</select>';
    accountData += `<label>Account Email:</label><input readonly value="${data.account_email}"> </input>`;
    accountData += `<input type="hidden" name="account_id" value="${data.account_id}">`;
    accountData += '<button class="management-btns" type="submit">Update Account Type</button>';
    accountData += '</form>';
    accountDisplay.innerHTML = accountData; 

    function isSelected(type, comparisonType) {
        return type === comparisonType ? 'selected' : '';
    }
}

function buildDeleteAccountForm(data) { 
    let accountDisplay = document.getElementById("accountDeleteForm"); 
    let accountData = '<br><h2>Delete Account</h2>';
    accountData += '<h3><strong>NOTE: DELETING AN ACCOUNT IS IRREVERSIBLE</strong></h3>',
    accountData += '<form action="/account/account-delete" class="general-form" method="post">'
    accountData += `<label>Account Firstname:</label><input readonly value="${data.account_firstname}"> </input>`,
    accountData += `<label>Account Lastname: </label><input readonly value="${data.account_lastname}"></input>`,
    accountData += `<label>Account Email:</label><input readonly value="${data.account_email}"></input>`,
    accountData += `<label>Account Type:</label><input readonly value="${data.account_type}"></input>`,
    accountData += `<input type="hidden" name="account_id" value=${data.account_id}>`,
    accountData += '<button class="management-btns" type="submit" id="deleteBTN">Delete</button>';
    accountData += '</form>'
    accountDisplay.innerHTML = accountData; 
}