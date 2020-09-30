const { db, rootKeys } = require('./db')

const UserType = {
  DEV:'developer',
  TRANSLATOR:'translator',
  REVIEWER:'reviewer'
}

/**
 * Add admin user to the database
 */
function addAdminUser() {
  try{
    db.getData(`${rootKeys.USER}/${id}`)
  } catch(error) {
    const username = 'pervez'
    const password = 'pervez'
    const id = 'pervez'
    db.push(`${rootKeys.USER}/${id}`, {
      id,
      username,
      password,
      role:['superAdminUser']
    })
  }
}
addAdminUser();


/**
 * Add user to the user list
 * @param {Object} userInfo contains user information
 * @param {string} type contains one of defined type 
 */
function addUser(userInfo, type){
  if(UserType[type]){
    db.push(`${rootKeys.USER}/${userInfo.id}`, {
      id:userInfo.id,
      username:userInfo.username,
      password:userInfo.password,
      role:[type]
    })
  } else {
    console.log('Error: add user: user type does not match')
  }
}

module.exports = {
  addUser,
  UserType
}